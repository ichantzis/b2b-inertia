<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PictufyService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PictufyController extends Controller
{
    protected $pictufy;

    public function __construct(PictufyService $pictufy)
    {
        $this->pictufy = $pictufy;
    }

    public function indexCollections()
    {
        // Fetch collections from the API.
        // The API docs show collections can be nested under categories,
        // or flat if skip_categories=1. Decide on the structure you want.
        // For a page similar to pictufy.com/collections, you might want categories.
        $apiCollectionsResponse = $this->pictufy->getCollections(['skip_categories' => 0]); // 0 to get categories, 1 for flat list

        $collectionsData = [];
        if (isset($apiCollectionsResponse['items'])) {
            // If skip_categories = 0, items are categories containing collections
            if (isset($apiCollectionsResponse['items'][0]['collections'])) { // Check if categorized
                $collectionsData = array_map(function ($category) {
                    return [
                        'category_id' => $category['category_id'] ?? null,
                        'category_name' => html_entity_decode($category['category_name'] ?? 'Unknown Category', ENT_QUOTES | ENT_HTML5),
                        'collections' => array_map(function ($collection) {
                            // Extract slug from URL
                            $urlPath = parse_url($collection['url'], PHP_URL_PATH);
                            $slug = basename($urlPath);
                            return [
                                'id' => $collection['id'],
                                'name' => html_entity_decode($collection['name'], ENT_QUOTES | ENT_HTML5),
                                'slug' => $slug,
                                'thumb' => $collection['thumb'] ?? null,
                                'artworks_count' => $collection['artworks'] ?? 0,
                                'description' => html_entity_decode($collection['description'] ?? '', ENT_QUOTES | ENT_HTML5),
                            ];
                        }, $category['collections'])
                    ];
                }, $apiCollectionsResponse['items']);
            } else { // Flat list of collections (if skip_categories = 1)
                $collectionsData = array_map(function ($collection) {
                    $urlPath = parse_url($collection['url'], PHP_URL_PATH);
                    $slug = basename($urlPath);
                    return [
                        'id' => $collection['id'],
                        'name' => html_entity_decode($collection['name'], ENT_QUOTES | ENT_HTML5),
                        'slug' => $slug,
                        'thumb' => $collection['thumb'] ?? null,
                        'artworks_count' => $collection['artworks'] ?? 0,
                        'description' => html_entity_decode($collection['description'] ?? '', ENT_QUOTES | ENT_HTML5),
                    ];
                }, $apiCollectionsResponse['items']);
            }
        }


        return Inertia::render('Collections', [
            // Pass either categorized_collections or flat_collections to Vue
            // depending on how you want to structure it.
            // For pictufy.com/collections look, categorized is better.
            'categorized_collections' => $collectionsData, // if skip_categories = 0
            // 'collections' => $collectionsData // if skip_categories = 1
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
        $collectionId = $request->input('collection_id'); // Note: was 'collection_id ' with a space, ensure it's correct
        $listId = $request->input('list_id'); // For lists, if applicable
        $filtersString = $request->input('filters', '');
        $order = $request->input('order', 'recommended');
        $searchTerm = $request->input('search'); // <-- GET SEARCH TERM

        $params = [
            'page' => $page,
            'per_page' => $perPage,
            'order' => $order
        ];

        if (!empty($collectionId)) {
            $params['collection_id'] = $collectionId;
        }

        if (!empty($listId)) {
            $params['list_id'] = $listId; // For fetching artworks from a specific list
        }

        if ($searchTerm) {
            $params['search'] = $searchTerm; // <-- ADD SEARCH TERM
        }

        // ... (your existing filter segment parsing logic for $filtersString) ...
        if (!empty($filtersString)) {
            $filter_segments = explode('/', $filtersString);
            foreach ($filter_segments as $segment) {
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
            $artwork = $this->pictufy->getArtworkDetails($id);
            return Inertia::render('ArtworkDetails', [
                'artwork' => $artwork['items'][0] ?? null, // API returns 'items' as an array
                'error' => null
            ]);
        } catch (\Exception $e) {
            Log::error("Error fetching artwork details for ID $id: " . $e->getMessage());
            return Inertia::render('ArtworkDetails', [
                'artwork' => null,
                'error' => 'Artwork not found or error fetching details.'
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
}
