<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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

    // Add this new method to get categories
    public function getCategories()
    {
        return $this->request('categories');
    }

    // Modify the getCategoryIdBySlug method
    public function getCategoryIdBySlug($categorySlug)
    {
        Log::info("Finding category ID for $categorySlug");
        $categories = $this->getCategories();

        // Remove 'cat_' prefix from the slug for comparison
        $categoryNameToFind = str_replace('cat_', '', $categorySlug);

        // Check both photography and illustration categories
        foreach (['photography', 'illustration'] as $section) {
            foreach ($categories['items'][$section] as $category) {
                $categorySlugFromName = strtolower(str_replace(' ', '-', $category['category_name']));
                if ($categorySlugFromName === $categoryNameToFind) {
                    return $category['category_id'];
                }
            }
        }

        return null;
    }

    public function getLists($params = [])
    {
        return $this->request('lists', $params);
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
