<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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

    private function request($endpoint, $params = [], $timeout = 30)
    {
        $response = Http::timeout($timeout)
            ->withHeaders([
                'X-AUTH-KEY' => $this->apiKey,
                'Content-Type' => 'application/x-www-form-urlencoded',
            ])->withOptions([
                'verify' => false,
            ])->asForm()
            ->post("$this->apiUrl/$endpoint", $params);

        if ($response->failed()) {
            Log::error("API request to $endpoint failed.", [
                'status' => $response->status(),
                'response' => $response->body()
            ]);
            return ['items' => [], 'status' => ['code' => $response->status(), 'returned_items' => 0]];
        }
        return $response->json();
    }

    public function getCollections($params = [])
    {
        $timeout = !empty($params['with_ids']) ? 180 : 30;
        Log::info("Fetching collections directly from API with params: " . json_encode($params));
        
        return $this->request('collections', $params, $timeout);
    }

    public function getCollectionIdBySlug($collectionSlug, $params = [])
    {
        $collectionsResponse = $this->getCollections(array_merge($params, ['skip_categories' => 1]));
        Log::info("Finding collection ID for slug: $collectionSlug");

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
        Log::warning("Collection ID not found for slug: $collectionSlug");
        return null;
    }

    public function getCollectionCategories()
    {
        Log::info('Fetching collection categories directly from API');
        return $this->request('collectioncategories');
    }

    public function getCollectionCategoryIdBySlug(string $categorySlugToFind): ?string
    {
        $collectionCategoriesResponse = $this->getCollectionCategories();

        if (isset($collectionCategoriesResponse['items']) && is_array($collectionCategoriesResponse['items'])) {
            foreach ($collectionCategoriesResponse['items'] as $category) {
                if (isset($category['category_name']) && isset($category['category_id'])) {
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
        Log::info('Fetching categories directly from API');
        return $this->request('categories');
    }

    public function getCategoryIdBySlug($categorySlug) 
    {
        Log::info("Finding category ID for slug (raw input): $categorySlug");
        $categoriesData = $this->getCategories(); 

        preg_match('/cat_([^_]+)_(.+)/', $categorySlug, $matches);

        if (count($matches) !== 3) {
            Log::warning("Invalid category slug format: $categorySlug. Expected 'cat_section_slugifiedcategoryname'.");
            return null;
        }

        $sectionKey = $matches[1];         
        $slugToFind = $matches[2]; 

        if (isset($categoriesData['items'][$sectionKey])) {
            foreach ($categoriesData['items'][$sectionKey] as $category) {
                if (isset($category['category_name']) && isset($category['category_id'])) {
                    $apiGeneratedSlug = Str::slug(html_entity_decode($category['category_name']));

                    if ($apiGeneratedSlug === $slugToFind) {
                        Log::info("Found category ID {$category['category_id']} for section '$sectionKey' and slug '$slugToFind'");
                        return $category['category_id'];
                    }
                }
            }
        }

        Log::warning("Category not found for slug: $categorySlug");
        return null;
    }

    public function getLists($params = []) 
    {
        Log::info('Fetching lists directly from API');
        return $this->request('lists', $params);
    }

    public function getArtworks($params = [])
    {
        $requestParams = [
            'page' => $params['page'] ?? 1,
            'per_page' => $params['per_page'] ?? 30,
            'order' => $params['order'] ?? 'recommended',
        ];

        if (isset($params['collection_id'])) $requestParams['collection_id'] = $params['collection_id'];
        if (isset($params['list_id'])) $requestParams['list_id'] = $params['list_id'];
        if (isset($params['category'])) $requestParams['category'] = $params['category'];
        if (isset($params['geometry'])) $requestParams['geometry'] = $params['geometry'];
        if (isset($params['color'])) $requestParams['color'] = $params['color'];
        if (isset($params['nudity'])) $requestParams['nudity'] = $params['nudity'];
        if (isset($params['artwork_type'])) $requestParams['artwork_type'] = $params['artwork_type'];
        if (isset($params['artist_id'])) $requestParams['artist_id'] = $params['artist_id'];
        if (isset($params['grade'])) $requestParams['grade'] = $params['grade'];
        if (!empty($params['search'])) { 
            $requestParams['search'] = $params['search'];
        }

        Log::debug("Service fetching artworks with params: " . json_encode($requestParams));
        return $this->request('artworks', $requestParams);
    }

    public function getArtworksCached($params = [], $cacheTag = 'general')
    {
        // Η μέθοδος διατηρήθηκε για συμβατότητα, αλλά πλέον φέρνει live δεδομένα
        Log::info("Fetching artworks (formerly cached, tag: $cacheTag) from API");
        return $this->getArtworks($params);
    }

    public function getArtworkDetails($artworkId)
    {
        return $this->request('artwork', ['artwork_id' => $artworkId]);
    }

    public function getArtistIdBySlug($slug)
    {
        $params = ['order' => 'alpha', 'per_page' => 2000];
        $response = $this->getArtists($params);
        $artists = $response['items'] ?? [];

        foreach ($artists as $artist) {
            if (isset($artist['username']) && strcasecmp($artist['username'], $slug) === 0) {
                return $artist['artist_id'];
            }
        }
        return null;
    }

    public function getArtists($params = [])
    {
        Log::info("Fetching artists directly from API with params: " . json_encode($params));
        return $this->request('artists', $params);
    }

    public function getArtist($artistId)
    {
        Log::info("Fetching artist details for ID: " . $artistId);
        return $this->request('artist', ['artist_id' => $artistId]);
    }

    public function getExpired()
    {
        return $this->request('expired', [], 60);
    }

    // Διατηρήθηκαν για αποφυγή σφαλμάτων (backward compatibility) αν καλούνται αλλού
    public function refreshListsCache()
    {
        return $this->getLists();
    }

    public function refreshCategoriesCache()
    {
        return $this->getCategories();
    }

    public function refreshCollectionsCache($params = [])
    {
        return $this->getCollections($params);
    }

    public function getDownloadUrl($artworkId)
    {
        Log::info("Requesting download URL for artwork ID: $artworkId");
        $response = $this->request('download', ['artwork_id' => $artworkId]);
        
        if (isset($response['items'][0]['url'])) {
            return $response['items'][0]; 
        }

        return null;
    }
}