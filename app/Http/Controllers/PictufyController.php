<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PictufyService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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

    public function showCollectionBySlug(Request $request, $collection_slug, $filters = null)
    {
        // 1. Get collection_id from collection_slug
        $collection = $this->pictufy->getCollectionIdBySlug($collection_slug); // You'll need to create/update this in PictufyService
        $collection_id = $collection['id'] ?? null; // Assuming the API returns an array with 'id' key
        $collectionName = html_entity_decode($collection['name'] ?? 'Artworks', ENT_QUOTES | ENT_HTML5);
        $collectionCover = $collection['cover'] ?? null; // Assuming the API returns a 'cover' key
        $collectionDescription = html_entity_decode($collection['description'] ?? '', ENT_QUOTES | ENT_HTML5);


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

        $params = [
            'page' => $page,
            'per_page' => $perPage,
            'order' => $order
        ];

        if ($filters) {
            $segments = explode('/', $filters);
            foreach ($segments as $segment) {
                // (Your existing filter logic for general artworks)
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

        Log::info("Fetching artworks with params: " . json_encode($params));
        $artworksResponse = $this->pictufy->getArtworks($params);

        return Inertia::render('Artworks', [
            'artworks' => $artworksResponse['items'] ?? [],
            'filters' => $filters ? explode('/', $filters) : [],
            'collectionName' => 'Artworks', // General title
            'nextPage' => isset($artworksResponse['items']) && count($artworksResponse['items']) >= $perPage ? $page + 1 : null,
        ]);
    }

    public function fetchData(Request $request) // For infinite scroll / loading more artworks
    {
        Log::info("Fetching more artworks with request: " . json_encode($request->all()));
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 30);
        $collectionId = $request->input('collection_id', ''); // Correctly named 'collection_id' now

        // Filters are expected as a slash-separated string from the frontend for this endpoint
        $filtersString = $request->input('filters', ''); // Expect a string, default to empty

        $order = $request->input('order', 'recommended'); // Order from query param

        $params = [
            'page' => $page,
            'per_page' => $perPage,
            'order' => $order
        ];

        if (!empty($collectionId)) {
            $params['collection_id'] = $collectionId;
        }

        // Process filtersString if it's not empty
        if (!empty($filtersString)) {
            $filter_segments = explode('/', $filtersString); // Explode the string into an array

            foreach ($filter_segments as $segment) { // Iterate over the exploded segments
                $segment = trim($segment); // Trim whitespace
                if (empty($segment)) {
                    continue; // Skip empty segments
                }

                // Handle order filter (though typically passed as 'order' param, good to be robust)
                if (in_array($segment, ['recommended', 'recently_added', 'best_selling', 'trending', 'oldest_first'])) {
                    $params['order'] = $segment; // Override if present in filters string
                    continue;
                }

                if (str_starts_with($segment, 'cat_')) {
                    $categoryId = $this->pictufy->getCategoryIdBySlug($segment);
                    if ($categoryId) {
                        $params['category'] = $categoryId; // API expects 'category' for category ID
                    }
                    continue;
                }
                if (in_array($segment, ['horizontal', 'vertical', 'square', 'panorama'])) {
                    $params['geometry'] = $segment;
                    continue;
                }
                // Add other filter types from your PictufyService->getArtworks supported params
                if (in_array($segment, ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'lilac', 'pink', 'highkey', 'lowkey'])) {
                    $params['color'] = $segment;
                    continue;
                }
                if ($segment === 'hide-nudes') {
                    $params['nudity'] = 'hide';
                } elseif ($segment === 'only-nudes') {
                    $params['nudity'] = 'yes';
                }
                // Add any other filter logic you have in filteredArtworks or filteredCollection
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

    public function filteredList($listId = null, $filters = null)
    {
        $params = [
            'list_id' => $listId,
            'per_page' => 30,
            'page' => 1,
            'order' => 'recommended'
        ];

        // Get list details to access the name
        $lists = $this->pictufy->getLists();
        $currentCollection = collect($lists['items'])->firstWhere('list_id', $listId);
        Log::info("Current list: " . json_encode($currentCollection));
        $collectionName = html_entity_decode($currentCollection['name'] ?? 'Artworks', ENT_QUOTES | ENT_HTML5);
        Log::info("Collection name: " . $collectionName);

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
            'filters' => $filters ? explode('/', $filters) : [],
            'nextPage' => isset($artworks['items']) && count($artworks['items']) > 0 ? 2 : null
        ]);
    }
}
