<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PictufyService;
use App\Services\SettingsService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

class PictufyController extends Controller
{
    protected $pictufy;
    protected $settings;

    public function __construct(PictufyService $pictufy, SettingsService $settings)
    {
        $this->pictufy = $pictufy;
        $this->settings = $settings;
    }

    public function homepage(Request $request)
    {
        // Fetch lists from the service (cached by default in PictufyService)
        $apiListsResponse = $this->pictufy->getLists(['per_page' => 15]);

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'curatedLists' => $apiListsResponse['items'] ?? [], // Pass the 15 items to Vue
        ]);
    }

    public function indexCollections()
    {
        // Fetch collections from the API.
        // The API docs show collections can be nested under categories,
        // or flat if skip_categories=1. Decide on the structure you want.
        $apiCollectionsResponse = $this->pictufy->getCollections(['skip_categories' => 0]);

        $collectionsData = [];
        if (isset($apiCollectionsResponse['items'])) {
            // Check if the response seems to be categorized (looking at the first item)
            // But we must handle cases where specific categories might be empty/malformed
            if (isset($apiCollectionsResponse['items'][0]['collections']) || isset($apiCollectionsResponse['items'][0]['category_name'])) {
                $collectionsData = array_map(function ($category) {
                    // Safety check: ensure 'collections' exists and is an array
                    $rawCollections = $category['collections'] ?? [];
                    if (!is_array($rawCollections)) {
                        $rawCollections = [];
                    }

                    return [
                        'category_id' => $category['category_id'] ?? null,
                        'category_name' => html_entity_decode($category['category_name'] ?? 'Unknown Category', ENT_QUOTES | ENT_HTML5),
                        'collections' => array_map(function ($collection) {
                            $urlPath = !empty($collection['url']) ? parse_url($collection['url'], PHP_URL_PATH) : '';
                            $slug = !empty($urlPath) ? basename($urlPath) : Str::slug($collection['name'] ?? 'collection');
                            
                            return [
                                'id' => $collection['id'] ?? null,
                                'name' => html_entity_decode($collection['name'] ?? 'Untitled', ENT_QUOTES | ENT_HTML5),
                                'slug' => $slug,
                                'thumb' => $collection['thumb'] ?? null,
                                'artworks_count' => $collection['artworks'] ?? 0,
                                'description' => html_entity_decode($collection['description'] ?? '', ENT_QUOTES | ENT_HTML5),
                            ];
                        }, $rawCollections) 
                    ];
                }, $apiCollectionsResponse['items']);
            } else { 
                // Flat list fallback (if skip_categories=1 was used or structure differs)
                $collectionsData = array_map(function ($collection) {
                    $urlPath = !empty($collection['url']) ? parse_url($collection['url'], PHP_URL_PATH) : '';
                    $slug = !empty($urlPath) ? basename($urlPath) : Str::slug($collection['name'] ?? 'collection');
                    
                    return [
                        'id' => $collection['id'] ?? null,
                        'name' => html_entity_decode($collection['name'] ?? 'Untitled', ENT_QUOTES | ENT_HTML5),
                        'slug' => $slug,
                        'thumb' => $collection['thumb'] ?? null,
                        'artworks_count' => $collection['artworks'] ?? 0,
                        'description' => html_entity_decode($collection['description'] ?? '', ENT_QUOTES | ENT_HTML5),
                    ];
                }, $apiCollectionsResponse['items']);
            }
        }

        return Inertia::render('Collections', [
            'categorized_collections' => $collectionsData,
        ]);
    }

    public function showCollectionsByCategorySlug(Request $request, $category_collection_slug)
    {
        Log::info("Attempting to show collections for category slug: " . $category_collection_slug);

        // Get the category ID from the slug using the service method
        $collection_category_id = $this->pictufy->getCollectionCategoryIdBySlug($category_collection_slug);

        if (!$collection_category_id) {
            Log::error("No category ID found for slug: " . $category_collection_slug);
            abort(404, 'Collection category not found.');
        }

        // Fetch the category name separately, as getCollections by category_id might not return it.
        // Or, if your getCollections API call for a specific category *does* return the category name,
        // you can simplify this.
        $categoryName = $this->pictufy->getCollectionCategoryNameById($collection_category_id) ?? ucfirst(str_replace('-', ' ', $category_collection_slug));


        // Call the PictufyService to get collections for the resolved category ID.
        $response = $this->pictufy->getCollections(['collection_category' => $collection_category_id]);

        $collections = [];

        // The API docs for /collections with 'collection_category' parameter suggest it returns
        // the category object which contains its own list of 'collections'.
        if (!empty($response['items']) && is_array($response['items'])) {
            $categoryData = $response['items'][0] ?? null; // Assuming the API returns the single category matching the ID

            if ($categoryData && isset($categoryData['collections']) && is_array($categoryData['collections'])) {
                // If category name is returned in this response, prefer it.
                $categoryName = html_entity_decode($categoryData['category_name'] ?? $categoryName, ENT_QUOTES | ENT_HTML5);

                $collections = array_map(function ($collection) {
                    $urlPath = !empty($collection['url']) ? parse_url($collection['url'], PHP_URL_PATH) : '';
                    // Generate a slug for the individual collection from its name if URL is missing
                    $collectionSlug = !empty($urlPath) ? basename($urlPath) : Str::slug($collection['name'] ?? 'untitled-collection');

                    return [
                        'id' => $collection['id'] ?? Str::random(10), // Ensure an ID exists
                        'name' => html_entity_decode($collection['name'] ?? 'Untitled Collection', ENT_QUOTES | ENT_HTML5),
                        'slug' => $collectionSlug, // This is the slug for individual collection linking
                        'thumb' => $collection['thumb'] ?? $collection['cover'] ?? null,
                        'artworks_count' => $collection['artworks'] ?? 0,
                        'description' => html_entity_decode($collection['description'] ?? '', ENT_QUOTES | ENT_HTML5),
                    ];
                }, $categoryData['collections']);
                Log::info("Found " . count($collections) . " collections for category: " . $categoryName . " (ID: " . $collection_category_id . ")");
            } else {
                Log::warning("No 'collections' array found within the response for category ID: " . $collection_category_id, ['response_item_0' => $categoryData]);
            }
        } else {
            Log::warning("API response for collections with category_id '$collection_category_id' was empty or not in expected format.", ['response' => $response]);
        }

        return Inertia::render('ByCategoryPage', [
            'categoryName' => $categoryName,
            'collections' => $collections,
            'categorySlug' => $category_collection_slug // Pass the original slug for context if needed
        ]);
    }

    public function showCollectionBySlug(Request $request, $collection_slug, $filters = null)
    {
        // 1. Get collection_id from collection_slug
        $collection = $this->pictufy->getCollectionIdBySlug($collection_slug); // You'll need to create/update this in PictufyService
        $collection_id = $collection['id'] ?? null; // Assuming the API returns an array with 'id' key
        $collectionName = html_entity_decode($collection['name'] ?? 'Artworks', ENT_QUOTES | ENT_HTML5);
        $collectionCover = $collection['cover'] ?? null; // Assuming the API returns a 'cover' key
        $collectionDescription = html_entity_decode($collection['description'] ?? '', ENT_QUOTES | ENT_HTML5);
        $searchTerm = $request->input('search'); // <-- GET SEARCH TERM FROM QUERY


        if (!$collection_id) {
            abort(404, 'Collection not found.');
        }

        // 2. Fetch artworks using collection_id
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 30); // Default 30 artworks
        $order = $request->input('order', 'recommended'); // Default order

        $params = [
            'collection_id' => $collection_id,
            'page' => $page,
            'per_page' => $perPage,
            'order' => $order,
        ];

        if ($searchTerm) {
            $params['search'] = $searchTerm; // <-- ADD SEARCH TERM TO PARAMS
        }

        if ($filters) {
            $segments = explode('/', $filters);
            foreach ($segments as $segment) {
                // (Your existing filter logic: order, category, geometry, color)
                if (in_array($segment, ['recommended', 'recently_added', 'best_selling', 'trending', 'oldest_first'])) {
                    $params['order'] = $segment;
                    continue;
                }
                if (str_starts_with($segment, 'cat_')) {
                    $categoryId = $this->pictufy->getCategoryIdBySlug($segment);
                    if ($categoryId) $params['category'] = $categoryId;
                    continue;
                }
                if (in_array($segment, ['horizontal', 'vertical', 'square', 'panorama'])) {
                    $params['geometry'] = $segment;
                    continue;
                }
                if (in_array($segment, ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'lilac', 'pink', 'highkey', 'lowkey'])) {
                    $params['color'] = $segment;
                    continue;
                }
            }
        }

        Log::info("Fetching artworks for collection slug '$collection_slug' (ID: $collection_id) with params: " . json_encode($params));
        $artworksResponse = $this->pictufy->getArtworks($params);

        return Inertia::render('Artworks', [ // Or a dedicated 'CollectionShow' view if the layout is very different
            'artworks' => $artworksResponse['items'] ?? [],
            'collectionId' => $collection_id, // Pass the actual ID
            'collectionName' => $collectionName, // Pass the fetched collection name
            'collectionCover' => $collectionCover, // Pass the fetched collection cover
            'collectionDescription' => $collectionDescription, // Pass the fetched collection description
            'collectionSlug' => $collection_slug,
            'currentSearchTerm' => $searchTerm, // <-- PASS SEARCH TERM TO VUE
            'filters' => $filters ? explode('/', $filters) : [],
            'nextPage' => isset($artworksResponse['items']) && count($artworksResponse['items']) >= $perPage ? $page + 1 : null,
        ]);
    }

    // This function is for the general /artworks page (not specific to a collection)
    public function filteredArtworks(Request $request, $filters = null)
    {
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 30);
        $order = $request->input('order', 'recommended');
        $searchTerm = $request->input('search'); // <-- GET SEARCH TERM FROM QUERY

        $params = [
            'page' => $page,
            'per_page' => $perPage,
            'order' => $order
        ];

        if ($searchTerm) {
            $params['search'] = $searchTerm; // <-- ADD SEARCH TERM TO PARAMS
        }

        $currentFilters = [];
        if ($filters) {
            $segments = explode('/', $filters);
            $currentFilters = $segments; // Store for passing to Vue
            foreach ($segments as $segment) {
                if (in_array($segment, ['recommended', 'recently_added', 'best_selling', 'trending', 'oldest_first'])) {
                    $params['order'] = $segment; // Order from path segment overrides query param if both present
                    continue;
                }
                if (str_starts_with($segment, 'cat_')) {
                    $categoryId = $this->pictufy->getCategoryIdBySlug($segment);
                    if ($categoryId) $params['category'] = $categoryId;
                    continue;
                }
                if (in_array($segment, ['horizontal', 'vertical', 'square', 'panorama'])) {
                    $params['geometry'] = $segment;
                    continue;
                }
                if (in_array($segment, ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'lilac', 'pink', 'highkey', 'lowkey'])) {
                    $params['color'] = $segment;
                    continue;
                }
                // Note: If you had a 'search_term' segment, you'd parse it here.
                // But we're using a query parameter for search.
            }
        }

        Log::info("Fetching artworks with params: " . json_encode($params));
        $artworksResponse = $this->pictufy->getArtworks($params);

        return Inertia::render('Artworks', [
            'artworks' => $artworksResponse['items'] ?? [],
            'filters' => $currentFilters, // Pass existing path-based filters
            'currentSearchTerm' => $searchTerm, // <-- PASS SEARCH TERM TO VUE
            'collectionName' => 'Artworks', // General title
            'nextPage' => isset($artworksResponse['items']) && count($artworksResponse['items']) >= $perPage ? $page + 1 : null,
            // You might also want to pass back pagination details from $artworksResponse if available
        ]);
    }


    public function fetchData(Request $request) // For infinite scroll / loading more artworks
    {
        Log::info("Fetching more artworks with request: " . json_encode($request->all()));
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 30);
        $collectionId = $request->input('collection_id');
        $listId = $request->input('list_id');
        $artistId = $request->input('artist_id');
        $filtersString = $request->input('filters', '');
        $order = $request->input('order', 'recommended');
        $searchTerm = $request->input('search');

        $params = [
            'page' => $page,
            'per_page' => $perPage,
            'order' => $order
        ];

        if (!empty($collectionId)) {
            $params['collection_id'] = $collectionId;
        }

        if (!empty($listId)) {
            $params['list_id'] = $listId;
        }

        if (!empty($artistId)) {
            $params['artist_id'] = $artistId;
        }

        if ($searchTerm) {
            $params['search'] = $searchTerm;
        }

        if (!empty($filtersString)) {
            $filter_segments = explode('/', $filtersString);
            foreach ($filter_segments as $segment) {
                // ... (keep existing filter parsing) ...
                if (in_array($segment, ['recommended', 'recently_added', 'best_selling', 'trending', 'oldest_first'])) {
                    $params['order'] = $segment;
                    continue;
                }
                if (str_starts_with($segment, 'cat_')) {
                    $categoryId = $this->pictufy->getCategoryIdBySlug($segment);
                    if ($categoryId) $params['category'] = $categoryId;
                    continue;
                }
                if (in_array($segment, ['horizontal', 'vertical', 'square', 'panorama'])) {
                    $params['geometry'] = $segment;
                    continue;
                }
                if (in_array($segment, ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'lilac', 'pink', 'highkey', 'lowkey'])) {
                    $params['color'] = $segment;
                    continue;
                }
            }
        }

        Log::info("Fetching artworks (fetchData) with processed params: " . json_encode($params));
        $response = $this->pictufy->getArtworks($params);

        return response()->json([
            'artworks' => $response['items'] ?? [],
            'nextPage' => (isset($response['items']) && count($response['items']) >= $perPage) ? $page + 1 : null,
        ]);
    }


    public function artworkDetails($id)
    {
        try {
            $artworkResponse = $this->pictufy->getArtworkDetails($id);
            $artwork = $artworkResponse['items'][0] ?? null;

            if ($artwork && isset($artwork['artist_id'])) {
                // Fetch artist details to get the 'username' (slug)
                // This uses the getArtist method which you already cached in the Service
                $artistResponse = $this->pictufy->getArtist($artwork['artist_id']);
                if (!empty($artistResponse['items'][0]['username'])) {
                    $artwork['artist_username'] = $artistResponse['items'][0]['username'];
                }
            }

            // Fetch Settings
            $requireLogin = $this->settings->get('require_login_for_prices', false);
            $pricingConfig = $this->settings->get('pricing_config', []);

            return Inertia::render('ArtworkDetails', [
                'artwork' => $artwork,
                'error' => null,
                'requireLoginForPrices' => $requireLogin,
                'pricingConfig' => $pricingConfig
            ]);

        } catch (\Exception $e) {
            Log::error("Error fetching artwork details for ID $id: " . $e->getMessage());
            return Inertia::render('ArtworkDetails', [
                'artwork' => null,
                'error' => 'Artwork not found or error fetching details.',
                'requireLoginForPrices' => false,
                'pricingConfig' => []
            ]);
        }
    }

    public function getCategories()
    {
        $categories = $this->pictufy->getCategories();
        return response()->json($categories);
    }

    public function lists()
    {
        // return response()->json($this->pictufy->getLists());
        return Inertia::render('Lists');
    }

    public function filteredList($listId = null, Request $request, $filters = null)
    {

        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 30); // Default 30 artworks
        $order = $request->input('order', 'recommended'); // Default order

        $params = [
            'list_id' => $listId,
            'per_page' => $perPage,
            'page' => $page,
            'order' => $order,
        ];

        // Get list details to access the name
        $lists = $this->pictufy->getLists();
        $currentCollection = collect($lists['items'])->firstWhere('list_id', $listId);
        $collectionName = html_entity_decode($currentCollection['name'] ?? 'Artworks', ENT_QUOTES | ENT_HTML5);
        $searchTerm = $request->input('search'); // <-- GET SEARCH TERM FROM QUERY

        if ($searchTerm) {
            $params['search'] = $searchTerm; // <-- ADD SEARCH TERM TO PARAMS
        }

        if ($filters) {
            $segments = explode('/', $filters);

            foreach ($segments as $segment) {
                // Handle order filter
                if (in_array($segment, ['recommended', 'recently_added', 'best_selling', 'trending', 'oldest_first'])) {
                    $params['order'] = $segment;
                    continue;
                }

                // Handle category
                if (str_starts_with($segment, 'cat_')) {
                    $categoryId = $this->pictufy->getCategoryIdBySlug($segment);
                    if ($categoryId) {
                        $params['category'] = $categoryId;
                    }
                    continue;
                }

                // Handle format/geometry filter
                if (in_array($segment, ['horizontal', 'vertical', 'square', 'panorama'])) {
                    $params['geometry'] = $segment;
                    continue;
                }

                // Handle color filter
                if (in_array($segment, ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'lilac', 'pink', 'highkey', 'lowkey'])) {
                    $params['color'] = $segment;
                    continue;
                }
            }
        }

        $artworks = $this->pictufy->getArtworks($params);

        return Inertia::render('Artworks', [
            'artworks' => $artworks['items'] ?? [],
            'collectionId' => $listId,
            'collectionName' => $collectionName,
            'currentSearchTerm' => $searchTerm,
            'filters' => $filters ? explode('/', $filters) : [],
            'nextPage' => isset($artworks['items']) && count($artworks['items']) >= $perPage ? $page + 1 : null,
            // 'nextPage' => isset($artworks['items']) && count($artworks['items']) > 0 ? 2 : null
        ]);
    }

    /**
     * Fetch related and recommended artworks for a specific artwork ID.
     * Called via AJAX to defer loading.
     */
    public function getRelatedContent(Request $request, $id)
    {
        try {
            // 1. Fetch the main artwork details first to get context
            $artworkResponse = $this->pictufy->getArtworkDetails($id);
            $artwork = $artworkResponse['items'][0] ?? null;

            if (!$artwork) {
                return response()->json(['related' => [], 'youMayLike' => []]);
            }

            // Extract Category ID
            $categoryId = $artwork['category_id'] ?? null;

            // Extract First Keyword (Tag)
            $firstTag = null;
            if (!empty($artwork['keywords']['en'])) {
                // Split by comma and take the first one
                $keywords = explode(',', $artwork['keywords']['en']);
                $firstTag = trim($keywords[0] ?? '');
            }

            // 2. Fetch "Related Products" (Same Category + First Tag)
            $relatedArtworks = [];
            if ($categoryId) {
                $relatedParams = [
                    'category' => $categoryId,
                    'per_page' => 12, // Fetch a few more to filter out the current ID safely
                    'order' => 'recommended' 
                ];
                
                // Add search param if tag exists
                if ($firstTag) {
                    $relatedParams['search'] = $firstTag;
                }

                // Create a unique cache tag
                $cacheTag = 'related_cat_' . $categoryId . ($firstTag ? '_tag_' . Str::slug($firstTag) : '');
                
                $response = $this->pictufy->getArtworksCached($relatedParams, $cacheTag);
                
                $relatedArtworks = collect($response['items'] ?? [])
                    ->filter(fn($item) => $item['id'] != $id) // Exclude current
                    ->take(8) // Limit to 8
                    ->values()
                    ->all();
            }

            // 3. Fetch "You May Also Like" (Trending fallback - Optional, kept for variety)
            $youMayLikeArtworks = [];
            // Strategy: Fallback to general trending
             $likeParams = [
                'order' => 'trending',
                'per_page' => 6,
            ];
            $response = $this->pictufy->getArtworksCached($likeParams, 'trending');
            $youMayLikeArtworks = collect($response['items'] ?? [])
                ->filter(fn($item) => $item['id'] != $id)
                ->take(4)
                ->values()
                ->all();
            

            return response()->json([
                'related' => $relatedArtworks,
                'youMayLike' => $youMayLikeArtworks
            ]);

        } catch (\Exception $e) {
            Log::error("Error fetching related content for artwork $id: " . $e->getMessage());
            return response()->json(['related' => [], 'youMayLike' => []]);
        }
    }


    /* =========================================================================
       ARTIST METHODS
       ========================================================================= */

    /**
     * Filter out artists with fewer than N artworks.
     */
    private function filterByMinArtworks($artists, $min = 10)
    {
        // The API returns the count in 'artworks' (or sometimes 'artwork_count' depending on endpoint version, 
        // but based on your Vue code it is 'artworks').
        return array_values(array_filter($artists, function ($artist) use ($min) {
            $count = $artist['artworks'] ?? 0;
            return $count >= $min;
        }));
    }

    /**
     * Group artists by their specific sub-category derived from artist_type.
     */
    private function groupArtistsBySubCategory($artists, $mainTypeKeyword)
    {
        $grouped = [];

        foreach ($artists as $artist) {
            $type = $artist['artist_type'] ?? '';

            if (Str::contains(strtolower($type), strtolower($mainTypeKeyword))) {
                // Remove the keyword to get the sub-category
                $subCategory = trim(str_ireplace($mainTypeKeyword, '', $type));

                if (empty($subCategory)) {
                    $subCategory = 'General';
                }

                if (!isset($grouped[$subCategory])) {
                    $grouped[$subCategory] = [];
                }

                $grouped[$subCategory][] = $artist;
            }
        }

        ksort($grouped);

        $rows = [];
        foreach ($grouped as $category => $items) {
            $rows[] = [
                'title' => $category,
                'items' => $items
            ];
        }

        return $rows;
    }

    /* =========================================================================
       ARTIST METHODS
       ========================================================================= */

    public function artistsOverview()
    {
        // Fetch slightly more items than needed to account for filtering
        $trendingResponse = $this->pictufy->getArtists(['order' => 'trending', 'per_page' => 60]);
        $trendingRaw = $trendingResponse['items'] ?? [];

        $countResponse = $this->pictufy->getArtists(['order' => 'artwork_count', 'per_page' => 60]);
        $biggestRaw = $countResponse['items'] ?? [];

        // Apply Filtering (> 10 artworks)
        $trending = $this->filterByMinArtworks($trendingRaw, 10);
        $biggest = $this->filterByMinArtworks($biggestRaw, 10);

        // Featured: Slice top 15 from the filtered trending list
        $featured = array_slice($trending, 0, 15);

        // Limit Trending and Biggest to 40 items
        $trendingLimited = array_slice($trending, 0, 40);
        $biggestLimited = array_slice($biggest, 0, 40);

        $rows = [
            [
                'title' => 'Featured Artists',
                'items' => $featured
            ],
            [
                'title' => 'Trending Now',
                'items' => $trendingLimited
            ],
            [
                'title' => 'Biggest Collections',
                'items' => $biggestLimited
            ]
        ];

        return Inertia::render('artists/Overview', [
            'activeTab' => 'overview',
            'rows' => $rows,
            'gridItems' => []
        ]);
    }

    public function artistsIllustrators()
    {
        $response = $this->pictufy->getArtists(['order' => 'trending', 'per_page' => 150]);
        $allArtists = $response['items'] ?? [];

        // Filter first
        $filteredArtists = $this->filterByMinArtworks($allArtists, 10);

        // Then Group
        $rows = $this->groupArtistsBySubCategory($filteredArtists, 'Illustrator');

        return Inertia::render('artists/Overview', [
            'activeTab' => 'illustrators',
            'rows' => $rows,
            'gridItems' => []
        ]);
    }

    public function artistsPhotographers()
    {
        $response = $this->pictufy->getArtists(['order' => 'trending', 'per_page' => 150]);
        $allArtists = $response['items'] ?? [];

        // Filter first
        $filteredArtists = $this->filterByMinArtworks($allArtists, 10);

        // Then Group
        $rows = $this->groupArtistsBySubCategory($filteredArtists, 'Photographer');

        return Inertia::render('artists/Overview', [
            'activeTab' => 'photographers',
            'rows' => $rows,
            'gridItems' => []
        ]);
    }

    public function artistsByCountry()
    {
        $response = $this->pictufy->getArtists(['order' => 'alpha', 'per_page' => 300]);
        $artists = $response['items'] ?? [];

        // Filter first
        $filteredArtists = $this->filterByMinArtworks($artists, 10);

        // Group by 'country'
        $grouped = collect($filteredArtists)->groupBy(function ($item) {
            return !empty($item['country']) ? $item['country'] : 'International';
        });

        // Sort Keys (Countries) Alphabetically
        $grouped = $grouped->sortKeys();

        $rows = [];
        foreach ($grouped as $country => $countryArtists) {
            if (empty($country)) continue;
            $rows[] = [
                'title' => $country,
                'items' => $countryArtists->values()->all()
            ];
        }

        return Inertia::render('artists/Overview', [
            'activeTab' => 'by-country',
            'rows' => $rows,
            'gridItems' => []
        ]);
    }

    public function artistsAll(Request $request)
    {
        $order = $request->input('order', 'alpha');

        // Fetch a larger page size to ensure we populate the list after filtering
        $response = $this->pictufy->getArtists(['order' => $order, 'per_page' => 100]);
        $rawArtists = $response['items'] ?? [];

        // Filter
        $filteredArtists = $this->filterByMinArtworks($rawArtists, 10);

        return Inertia::render('artists/Index', [
            'artists' => $filteredArtists,
            'currentOrder' => $order
        ]);
    }

    public function showArtist(Request $request, $artist_slug, $filters = null)
    {
        // 1. Resolve Artist Slug to ID
        $artist_id = $this->pictufy->getArtistIdBySlug($artist_slug);

        if (!$artist_id) {
            abort(404, 'Artist not found.');
        }

        // 2. Fetch Artist Details
        $artistResponse = $this->pictufy->getArtist($artist_id);
        $artist = $artistResponse['items'][0] ?? null;

        if (!$artist) {
            abort(404, 'Artist details could not be retrieved.');
        }

        $collectionName = html_entity_decode($artist['name'] ?? 'Artist', ENT_QUOTES | ENT_HTML5);
        $collectionCover = $artist['profile_picture'] ?? null;
        $collectionDescription = html_entity_decode($artist['biography_text'] ?? ($artist['artist_type'] ?? ''), ENT_QUOTES | ENT_HTML5);

        // 3. Initialize API Parameters
        $params = [
            'artist_id' => $artist_id,
            'page' => (int) $request->input('page', 1),
            'per_page' => (int) $request->input('per_page', 30),
            'order' => $request->input('order', 'recommended'),
        ];

        if ($request->input('search')) {
            $params['search'] = $request->input('search');
        }

        // 4. Parse URL Filters
        if ($filters) {
            $segments = explode('/', $filters);

            $validColors = ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'lilac', 'pink', 'white', 'gray', 'black', 'brown', 'highkey', 'lowkey'];
            $validGeometries = ['horizontal', 'vertical', 'square', 'panorama'];
            $validOrders = ['recommended', 'recently_added', 'best_selling', 'trending', 'oldest_first'];

            $collectedColors = [];
            $collectedGeometries = [];

            foreach ($segments as $segment) {
                // A. Sort Order
                if (in_array($segment, $validOrders)) {
                    $params['order'] = $segment;
                    continue;
                }

                // B. Geometry
                if (in_array($segment, $validGeometries)) {
                    $collectedGeometries[] = $segment;
                    continue;
                }

                // C. Colors
                if (in_array($segment, $validColors)) {
                    $collectedColors[] = $segment;
                    continue;
                }

                // D. Categories
                if (Str::startsWith($segment, 'cat_')) {
                    $categoryId = $this->pictufy->getCategoryIdBySlug($segment);
                    if ($categoryId) {
                        $params['category'] = $categoryId;
                    }
                    continue;
                }
            }

            if (!empty($collectedColors)) {
                $params['color'] = implode(',', $collectedColors);
            }
            if (!empty($collectedGeometries)) {
                $params['geometry'] = implode(',', $collectedGeometries);
            }
        }

        // 5. Fetch Artworks
        $artworksResponse = $this->pictufy->getArtworks($params);

        return Inertia::render('Artworks', [
            'artworks' => $artworksResponse['items'] ?? [],
            'collectionId' => (string) $artist_id,
            'collectionSlug' => $artist_slug,
            'collectionName' => $collectionName,
            'collectionCover' => $collectionCover,
            'collectionDescription' => $collectionDescription,
            'isArtistPage' => true,
            'currentSearchTerm' => $request->input('search'),
            'filters' => $filters ? explode('/', $filters) : [],
            'nextPage' => isset($artworksResponse['items']) && count($artworksResponse['items']) >= $params['per_page'] ? $params['page'] + 1 : null,
        ]);
    }
}
