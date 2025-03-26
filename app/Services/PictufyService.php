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
        Log::info("Requesting $endpoint with params: " . json_encode($params));
        return Http::withHeaders([
            'X-AUTH-KEY' => $this->apiKey,
            'Content-Type' => 'application/x-www-form-urlencoded',
        ])->withOptions([
            'verify' => false,
        ])->asForm()  // This ensures data is sent as form-urlencoded
            ->post("$this->apiUrl/$endpoint", $params)
            ->json();
    }

    public function getCollections($params = [])
    {
        return $this->request('collections', $params);
    }

    public function getCollectionIdByName($collectionName)
    {
        $collections = $this->getCollections();

        foreach ($collections['items'] as $category) {
            foreach ($category['collections'] as $collection) {
                // Extract the last part of the URL which is the collection slug
                $urlSlug = basename($collection['url']);
                if ($urlSlug === $collectionName) {
                    return $collection['id'];
                }
            }
        }

        return null;
    }

    public function getCategories()
    {
        // Cache key for categories
        $cacheKey = 'pictufy_categories';
        
        // Cache duration in minutes (e.g., 60 minutes = 1 hour)
        $cacheDuration = 60;

        if (Cache::has($cacheKey)) {
            $cachedData = Cache::get($cacheKey);
            Log::info('Retrieved categories from cache:', [
                'key' => $cacheKey,
                'sections' => array_keys($cachedData['items'] ?? [])
            ]);
            return $cachedData;
        }

        return Cache::remember($cacheKey, $cacheDuration, function () {
            return $this->request('categories');;
        });
    }

    /**
     * Force refresh the categories cache
     */
    public function refreshCategoriesCache()
    {
        $cacheKey = 'pictufy_categories';
        Cache::forget($cacheKey);
        return $this->getCategories();
    }

    public function getCategoryIdBySlug($categorySlug)
    {
        Log::info("Finding category ID for $categorySlug");
        $categories = $this->getCategories();

        // Extract section and category name from the slug
        // Example: 'cat_photography_abstract' -> ['photography', 'abstract']
        preg_match('/cat_(\w+)_(.+)/', $categorySlug, $matches);
        
        if (count($matches) !== 3) {
            Log::warning("Invalid category slug format: $categorySlug");
            return null;
        }

        $section = $matches[1];
        $categoryNameToFind = $matches[2];

        // Check only in the specified section
        if (isset($categories['items'][$section])) {
            foreach ($categories['items'][$section] as $category) {
                $categorySlugFromName = strtolower(str_replace(' ', '-', $category['category_name']));
                if ($categorySlugFromName === $categoryNameToFind) {
                    Log::info("Found category ID {$category['category_id']} for $categorySlug");
                    return $category['category_id'];
                }
            }
        }

        Log::warning("Category not found for slug: $categorySlug");
        return null;
    }

    public function getLists($params = [])
    {
        // Cache key for the lists
        $cacheKey = 'pictufy_lists';
        
        // Cache duration in minutes (e.g., 60 minutes = 1 hour)
        $cacheDuration = 60;

        if (Cache::has($cacheKey)) {
            $cachedData = Cache::get($cacheKey);
            Log::info('Retrieved from cache:', [
                'key' => $cacheKey,
                'data' => $cachedData
            ]);
        }

        return Cache::remember($cacheKey, $cacheDuration, function () use ($params) {
            return $this->request('lists', $params);
        });
    }

    /**
     * Force refresh the lists cache
     */
    public function refreshListsCache()
    {
        $cacheKey = 'pictufy_lists';
        Cache::forget($cacheKey);
        return $this->getLists();
    }

    public function getArtworks($params = [])
    {
        $requestParams = [];

        if (isset($params['list_id'])) {
            $requestParams['list_id'] = $params['list_id'];
        }

        // Handle single category
        if (isset($params['category']) && !empty($params['category'])) {
            $requestParams['category'] = $params['category'];
            // $categoryId = $this->getCategoryIdBySlug($params['category']);
            // Log::info("Category ID for {$params['category']} is $categoryId");
            // if ($categoryId) {
            //     $requestParams['category'] = $categoryId;
            // }
        }

        // Handle filters
        if (isset($params['order'])) {
            $requestParams['order'] = $params['order'];
        }
        if (isset($params['geometry'])) {
            $requestParams['geometry'] = $params['geometry'];
        }
        if (isset($params['color'])) {
            $requestParams['color'] = $params['color'];
        }
        if (isset($params['nudity'])) {
            $requestParams['nudity'] = $params['nudity'];
        }

        // Handle pagination
        if (isset($params['page'])) {
            $requestParams['page'] = $params['page'];
        }
        if (isset($params['per_page'])) {
            $requestParams['per_page'] = $params['per_page'];
        }
        
        return $this->request('artworks', $requestParams);
    }

    public function getArtworkDetails($artworkId)
    {
        return $this->request('artwork', ['artwork_id' => $artworkId]);
    }
}
