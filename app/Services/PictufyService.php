<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

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

    /**
     * Get all collection categories from the API.
     * Caches the result.
     */
    public function getCollectionCategories()
    {
        $cacheKey = 'pictufy_collection_categories';
        $cacheDuration = 1440; // Cache for 24 hours (adjust as needed)

        return Cache::remember($cacheKey, $cacheDuration, function () {
            Log::info('Fetching collection categories from API');
            // The API docs specify the endpoint as /collectioncategories
            return $this->request('collectioncategories');
        });
    }

    /**
     * Get a collection category's ID by its generated slug.
     *
     * @param string $slug
     * @return string|null The category_id or null if not found.
     */
    public function getCollectionCategoryIdBySlug(string $categorySlugToFind): ?string
    {
        $collectionCategoriesResponse = $this->getCollectionCategories();

        if (isset($collectionCategoriesResponse['items']) && is_array($collectionCategoriesResponse['items'])) {
            foreach ($collectionCategoriesResponse['items'] as $category) {
                if (isset($category['category_name']) && isset($category['category_id'])) {
                    // Generate a slug from the category_name in the same way links would be generated
                    $generatedSlug = Str::slug(html_entity_decode($category['category_name']));
                    if ($generatedSlug === $categorySlugToFind) {
                        return $category['category_id'];
                    }
                }
            }
        }
        Log::warning("Collection category ID not found for slug: " . $categorySlugToFind);
        return null;
    }

    /**
     * Get a collection category's name by its ID.
     * (This might be useful if fetching collections by ID doesn't return the category name directly)
     *
     * @param string $categoryId
     * @return string|null The category_name or null if not found.
     */
    public function getCollectionCategoryNameById(string $categoryId): ?string
    {
        $collectionCategoriesResponse = $this->getCollectionCategories();

        if (isset($collectionCategoriesResponse['items']) && is_array($collectionCategoriesResponse['items'])) {
            foreach ($collectionCategoriesResponse['items'] as $category) {
                if (isset($category['category_id']) && $category['category_id'] === $categoryId && isset($category['category_name'])) {
                    return html_entity_decode($category['category_name'], ENT_QUOTES | ENT_HTML5);
                }
            }
        }
        Log::warning("Collection category name not found for ID: " . $categoryId);
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
        Log::info("Finding category ID for slug (raw input): $categorySlug");
        $categoriesData = $this->getCategories(); // This should return your API structure

        // Expected slug format: cat_sectionkey_category-name-slug
        preg_match('/cat_([^_]+)_(.+)/', $categorySlug, $matches);

        if (count($matches) !== 3) {
            Log::warning("Invalid category slug format: $categorySlug. Expected 'cat_section_slugifiedcategoryname'.");
            return null;
        }

        $sectionKey = $matches[1];         // e.g., 'photography'
        $slugToFind = $matches[2]; // e.g., 'text-quotes' or 'text-&-quotes' (this is what client sends)

        if (isset($categoriesData['items'][$sectionKey])) {
            foreach ($categoriesData['items'][$sectionKey] as $category) {
                if (isset($category['category_name']) && isset($category['category_id'])) {
                    // Generate a slug from the API's category_name using Laravel's Str::slug
                    // This will handle '&' and other special characters correctly, typically by removing them.
                    $apiGeneratedSlug = Str::slug(html_entity_decode($category['category_name']));
                    Log::debug("Comparing API generated slug '$apiGeneratedSlug' with slug to find '$slugToFind'");

                    if ($apiGeneratedSlug === $slugToFind) {
                        Log::info("Found category ID {$category['category_id']} for section '$sectionKey' and slug '$slugToFind' (Original API name: '{$category['category_name']}')");
                        return $category['category_id'];
                    }
                }
            }
        }

        Log::warning("Category not found for slug: $categorySlug (Section: $sectionKey, Processed Slug to Find: $slugToFind)");
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
        if (isset($params['list_id'])) $requestParams['list_id'] = $params['list_id'];
        if (isset($params['category'])) $requestParams['category'] = $params['category'];
        if (isset($params['geometry'])) $requestParams['geometry'] = $params['geometry'];
        if (isset($params['color'])) $requestParams['color'] = $params['color'];
        if (isset($params['nudity'])) $requestParams['nudity'] = $params['nudity'];
        if (isset($params['artwork_type'])) $requestParams['artwork_type'] = $params['artwork_type'];
        if (isset($params['artist_id'])) $requestParams['artist_id'] = $params['artist_id'];

        // *** ADD SEARCH PARAMETER HERE ***
        if (!empty($params['search'])) { // Check if search term is provided and not empty
            $requestParams['search'] = $params['search'];
        }
        // Add other params as needed: from_timestamp, grade, aspect_ratio, resolution, people, buildings, animals, etc.

        Log::debug("Service fetching artworks with params: " . json_encode($requestParams));
        return $this->request('artworks', $requestParams);
    }

    /**
     * Get Cached Artworks for sections like "You May Also Like"
     * Caches for 60 minutes.
     */
    public function getArtworksCached($params = [], $cacheTag = 'general')
    {
        // Unique cache key based on params
        $cacheKey = 'pictufy_artworks_' . $cacheTag . '_' . md5(json_encode($params));
        $cacheDuration = 60; // 1 hour

        return Cache::remember($cacheKey, $cacheDuration, function () use ($params, $cacheTag) {
            Log::info("Fetching cached artworks ($cacheTag) from API");
            return $this->getArtworks($params);
        });
    }

    public function getArtworkDetails($artworkId)
    {
        // API params: artwork_id, translate, languages
        return $this->request('artwork', ['artwork_id' => $artworkId]);
    }

    /**
     * Resolve artist ID from username (slug).
     * Uses a large cached list to minimize API calls.
     */
    public function getArtistIdBySlug($slug)
    {
        // We fetch a large list of artists sorted alphabetically to create a lookup directory.
        // Caching this response effectively creates our "Slug -> ID" database.
        // Adjust per_page if your artist count exceeds 2000.
        $params = ['order' => 'alpha', 'per_page' => 2000]; 
        
        $response = $this->getArtists($params);
        $artists = $response['items'] ?? [];

        // Case-insensitive search for the username
        foreach ($artists as $artist) {
            // Ensure we check if 'username' exists, fallback to name matching if strictly needed (optional)
            if (isset($artist['username']) && strcasecmp($artist['username'], $slug) === 0) {
                return $artist['artist_id'];
            }
        }

        return null;
    }

    public function getArtists($params = [])
    {
        $cacheKey = 'pictufy_artists_' . md5(json_encode($params));
        $cacheDuration = 60; // Cache for 60 minutes

        return Cache::remember($cacheKey, $cacheDuration, function () use ($params) {
            Log::info("Fetching artists from API with params: " . json_encode($params));
            return $this->request('artists', $params);
        });
    }

    public function getArtist($artistId)
    {
        $cacheKey = 'pictufy_artist_' . $artistId;
        $cacheDuration = 60;

        return Cache::remember($cacheKey, $cacheDuration, function () use ($artistId) {
            Log::info("Fetching artist details for ID: " . $artistId);
            return $this->request('artist', ['artist_id' => $artistId]);
        });
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
