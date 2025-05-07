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

    public function collections()
    {
        // $lists = $this->pictufy->getLists();
        return Inertia::render('Collections');
    }

    public function artworks(Request $request)
    {
        $page = $request->input('page', 1); // Default page 1
        $perPage = $request->input('per_page', 30); // Default 30 artworks per request
        $order = $request->input('order', 'recommended'); // Default order by best selling

        $response = $this->pictufy->getArtworks([
            'page' => $page,
            'per_page' => $perPage,
            'order' => $order
        ]);

        return Inertia::render('Artworks', [
            'artworks' => $response['items'] ?? [],
            'nextPage' => count($response['items'] ?? []) > 0 ? $page + 1 : null, // If no more items, stop loading
        ]);
    }

    public function fetchData(Request $request)
    {
        Log::info("Fetching more artworks with request: " . json_encode($request->all()));
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 30);
        $listId = $request->input('collection', '');
        $filters = $request->input('filters', []);
        $order = $request->input('order', 'recommended');

        $params = [
            'list_id' => $listId,
            'page' => $page,
            'per_page' => $perPage,
            'order' => $order
        ];

        if (!empty($filters)) {
            foreach ($filters as $filter) {
                // Handle category (only first one found)
                if (str_starts_with($filter, 'cat_')) {
                    $categoryId = $this->pictufy->getCategoryIdBySlug($filter);
                    if ($categoryId) {
                        $params['category'] = $categoryId;
                    }
                    continue;
                }

                // Handle order filter
                if (in_array($filter, ['recommended', 'recently_added', 'best_selling', 'trending', 'oldest_first'])) {
                    $params['order'] = $filter;
                    continue;
                }

                // Handle geometry filter
                if (in_array($filter, ['horizontal', 'vertical', 'square', 'panorama'])) {
                    $params['geometry'] = $filter;
                    continue;
                }

                // Handle color filter
                if (in_array($filter, ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'lilac', 'pink', 'highkey', 'lowkey'])) {
                    $params['color'] = $filter;
                    continue;
                }

                // Handle nudity filter
                if ($filter === 'hide-nudes') {
                    $params['nudity'] = 'hide';
                } elseif ($filter === 'only-nudes') {
                    $params['nudity'] = 'yes';
                }
            }
        }

        Log::info("Fetching artworks with params: " . json_encode($params));
        $response = $this->pictufy->getArtworks($params);

        return response()->json([
            'artworks' => $response['items'] ?? [],
            'nextPage' => isset($response['items']) && count($response['items']) > 0 ? $page + 1 : null,
        ]);
    }

    public function artworkDetails($id)
    {
        try {
            $artwork = $this->pictufy->getArtworkDetails($id);
            return Inertia::render('ArtworkDetails', [
                'artwork' => $artwork['items'] ?? null,
                'error' => null
            ]);
        } catch (\Exception $e) {
            return Inertia::render('ArtworkDetails', [
                'artwork' => null,
                'error' => 'Artwork not found'
            ]);
        }
    }

    public function filteredCollection($collectionId = null, $filters = null)
    {
        $params = [
            'collection_id' => $collectionId,
            'per_page' => 30,
            'page' => 1,
            'order' => 'recommended'
        ];

        // Get list details to access the name
        $collections = $this->pictufy->getCollections();
        $currentCollection = collect($collections['items'])->firstWhere('collection_id', $collectionId);
        Log::info("Current collection: " . json_encode($currentCollection));
        $collectionName = html_entity_decode($currentCollection['name'] ?? 'Artworks', ENT_QUOTES | ENT_HTML5);

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
            'collectionId' => $collectionId,
            'collectionName' => $collectionName,
            'filters' => $filters ? explode('/', $filters) : [],
            'nextPage' => isset($artworks['items']) && count($artworks['items']) > 0 ? 2 : null
        ]);
    }

    public function filteredArtworks($filters = null)
    {
        $params = [
            'per_page' => 30,
            'page' => 1,
            'order' => 'recommended'
        ];

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
            'filters' => $filters ? explode('/', $filters) : [],
            'nextPage' => isset($artworks['items']) && count($artworks['items']) > 0 ? 2 : null
        ]);
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

    public function getCategories()
    {
        $categories = $this->pictufy->getCategories();
        return response()->json($categories);
    }
}
