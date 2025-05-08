<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class PictufyService
{
    protected $apiUrl;
    protected $apiKey;

    public function __construct()
    {
        $this->apiUrl = config('services.pictufy.url');
        $this->apiKey = config('services.pictufy.key');
    }

    private function request($endpoint, $params = [])
    {
        // Log::info("Requesting $endpoint with params: " . json_encode($params)); // Can be verbose
        $response = Http::withHeaders([
            'X-AUTH-KEY' => $this->apiKey,
            'Content-Type' => 'application/x-www-form-urlencoded',
        ])->withOptions([
            'verify' => false, // Consider true in production with valid SSL
        ])->asForm()
            ->post("$this->apiUrl/$endpoint", $params);

        if ($response->failed()) {
            Log::error("API request to $endpoint failed.", [
                'status' => $response->status(),
                'response' => $response->body()
            ]);
            return ['items' => [], 'status' => ['code' => $response->status(), 'returned_items' => 0]]; // Ensure consistent error structure
        }
        return $response->json();
    }

    public function getCollections($params = [])
    {
        // API docs params: collection_category, order, with_ids, skip_categories
        $cacheKey = 'pictufy_collections_' . md5(json_encode($params));
        $cacheDuration = 60; // Cache for 60 minutes

        return Cache::remember($cacheKey, $cacheDuration, function () use ($params) {
            Log::info("Fetching collections from API with params: " . json_encode($params));
            return $this->request('collections', $params);
        });
    }

    // Updated to use slug and search in the 'url' field
    public function getCollectionIdBySlug($collectionSlug, $params = [])
    {
        // Fetch all collections (flat list is easier for slug matching)
        // The 'url' field contains the full URL, so we extract the slug (basename)
        $collectionsResponse = $this->getCollections(array_merge($params, ['skip_categories' => 1]));
        Log::info("Finding collection ID for slug: $collectionSlug");
        Log::debug("Collections response: " . json_encode($collectionsResponse));

        if (isset($collectionsResponse['items'])) {
            foreach ($collectionsResponse['items'][0]['collections'] as $collection) {
                if (isset($collection['url'])) {
                    $urlPath = parse_url($collection['url'], PHP_URL_PATH);
                    $slugFromApi = basename($urlPath);
                    if ($slugFromApi === $collectionSlug) {
                        return $collection ?? null;
                    }
                }
            }
        }
        // If collections are categorized (skip_categories = 0) and you didn't fetch flat
        // you would need to iterate through categories then their collections.
        Log::warning("Collection ID not found for slug: $collectionSlug");
        return null;
    }


    public function getCategories()
    {
        $cacheKey = 'pictufy_categories';
        $cacheDuration = 1440; // Cache for 24 hours

        return Cache::remember($cacheKey, $cacheDuration, function () {
            Log::info('Fetching categories from API');
            return $this->request('categories');
        });
    }

    public function getCategoryIdBySlug($categorySlug) // from 'cat_section_categoryname'
    {
        Log::info("Finding category ID for slug: $categorySlug");
        $categoriesData = $this->getCategories();

        preg_match('/cat_([^_]+)_(.+)/', $categorySlug, $matches);
        
        if (count($matches) !== 3) {
            Log::warning("Invalid category slug format: $categorySlug");
            return null;
        }

        $sectionKey = $matches[1]; // e.g., 'photography'
        $categoryNameSlug = str_replace('-', ' ', $matches[2]); // e.g., 'abstract' from 'abstract'

        if (isset($categoriesData['items'][$sectionKey])) {
            foreach ($categoriesData['items'][$sectionKey] as $category) {
                // Compare by creating a slug from the API's category_name or directly if API provides slug
                $apiCategoryNameSlug = strtolower(str_replace(' ', '-', $category['category_name']));
                if ($apiCategoryNameSlug === str_replace(' ', '-', $categoryNameSlug)) { // Normalize comparison
                    Log::info("Found category ID {$category['category_id']} for $categorySlug");
                    return $category['category_id'];
                }
            }
        }

        Log::warning("Category not found for slug: $categorySlug (Section: $sectionKey, Name Slug: $categoryNameSlug)");
        return null;
    }

    public function getLists($params = []) // For /lists endpoint if needed
    {
        $cacheKey = 'pictufy_lists_' . md5(json_encode($params));
        $cacheDuration = 60;

        return Cache::remember($cacheKey, $cacheDuration, function () use ($params) {
            Log::info('Fetching lists from API');
            return $this->request('lists', $params);
        });
    }
    
    public function getArtworks($params = [])
    {
        // Default params if not set
        $requestParams = [
            'page' => $params['page'] ?? 1,
            'per_page' => $params['per_page'] ?? 30,
            'order' => $params['order'] ?? 'recommended',
        ];

        // Specific filters from API docs
        if (isset($params['collection_id'])) $requestParams['collection_id'] = $params['collection_id'];
        if (isset($params['list_id'])) $requestParams['list_id'] = $params['list_id']; // If you use lists
        if (isset($params['category'])) $requestParams['category'] = $params['category']; // This is category_id
        if (isset($params['geometry'])) $requestParams['geometry'] = $params['geometry'];
        if (isset($params['color'])) $requestParams['color'] = $params['color'];
        if (isset($params['nudity'])) $requestParams['nudity'] = $params['nudity'];
        if (isset($params['artwork_type'])) $requestParams['artwork_type'] = $params['artwork_type'];
        if (isset($params['artist_id'])) $requestParams['artist_id'] = $params['artist_id'];
        // Add other params as needed: from_timestamp, grade, aspect_ratio, resolution, people, buildings, animals, search etc.
        
        Log::debug("Service fetching artworks with params: " . json_encode($requestParams));
        return $this->request('artworks', $requestParams);
    }

    public function getArtworkDetails($artworkId)
    {
        // API params: artwork_id, translate, languages
        return $this->request('artwork', ['artwork_id' => $artworkId]);
    }
    
    public function refreshListsCache()
    {
        $cacheKey = 'pictufy_lists'; // Example for one list type
        Cache::forget($cacheKey);
        // Potentially forget other related caches like specific list params
        return $this->getLists();
    }

    public function refreshCategoriesCache()
    {
        $cacheKey = 'pictufy_categories';
        Cache::forget($cacheKey);
        return $this->getCategories();
    }
    
    public function refreshCollectionsCache($params = []) // For specific collection cache if params are used
    {
        $cacheKey = 'pictufy_collections_' . md5(json_encode($params));
        Cache::forget($cacheKey);
        return $this->getCollections($params);
    }
}