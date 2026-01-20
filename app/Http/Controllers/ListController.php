<?php

namespace App\Http\Controllers;

use App\Models\ArtworkList;
use App\Models\Category; // Needed if you handle filters like 'cat_photography'
use App\Models\Artwork;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ListController extends Controller
{
    /**
     * Display the overview page of all lists.
     * URI: /lists
     */
    public function index()
    {
        // Fetch all lists ordered by name (or sort_order if you add that column)
        $lists = ArtworkList::orderBy('name')->get();

        return Inertia::render('Lists', [
            'lists' => $lists
        ]);
    }

    /**
     * Display a specific list and its artworks.
     * URI: /lists/{slug}/{filters?}
     */
    public function show(Request $request, $slug, $filters = null)
    {
        // 1. Find the List by its Slug
        $list = ArtworkList::where('slug', $slug)->firstOrFail();

        // 2. Parse Filters and Pagination Parameters
        $params = $this->parseFilters($filters, $request);

        // 3. Build the Query using the Many-to-Many relationship
        // Start querying artworks specifically belonging to this list
        $query = $list->artworks(); 

        // Apply additional filters (like Category, Colors, etc.)
        $query = $this->applyFiltersToQuery($query, $params);

        // 4. Fetch the Data
        $artworks = $query->paginate($params['per_page'])->withQueryString();

        return Inertia::render('Artworks', [
            'artworks' => $artworks->items(),
            
            // Pass List Metadata to the View
            'collectionName' => $list->name,
            'collectionDescription' => $list->description,
            'collectionCover' => $list->thumb,
            
            'isListPage' => true, // Flag for frontend logic if needed
            'filters' => $filters ? explode('/', $filters) : [],
            'currentSearchTerm' => $params['search'],
            'nextPage' => $artworks->hasMorePages() ? $artworks->currentPage() + 1 : null,
        ]);
    }

    /**
     * Helper: Parse URL filters and Request inputs into a params array.
     */
    private function parseFilters($filtersString, Request $request)
    {
        $params = [
            'page' => (int) $request->input('page', 1),
            'per_page' => (int) $request->input('per_page', 30),
            'order' => $request->input('order', 'recommended'),
            'search' => $request->input('search'),
            'category_id' => null,
            'geometry' => null,
            'colors' => [],
        ];

        if ($filtersString) {
            $segments = explode('/', $filtersString);
            foreach ($segments as $segment) {
                // Parse Order
                if (in_array($segment, ['recommended', 'recently_added', 'best_selling', 'trending', 'oldest_first'])) {
                    $params['order'] = $segment;
                    continue;
                }
                
                // Parse Category (e.g., 'cat_photography')
                if (str_starts_with($segment, 'cat_')) {
                    $slug = substr($segment, 4);
                    // Find Category ID from DB
                    $category = Category::where('slug', $slug)->first();
                    if ($category) $params['category_id'] = $category->id; // Using local ID now
                    continue;
                }

                // Parse Geometry
                if (in_array($segment, ['horizontal', 'vertical', 'square', 'panorama'])) {
                    $params['geometry'] = $segment;
                    continue;
                }

                // Parse Colors
                if (in_array($segment, ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'lilac', 'pink', 'highkey', 'lowkey'])) {
                    $params['colors'][] = $segment;
                    continue;
                }
            }
        }
        return $params;
    }

    /**
     * Helper: Apply the parsed filters to the Eloquent Query Builder.
     */
    private function applyFiltersToQuery($query, $params)
    {
        // Search Filter
        if (!empty($params['search'])) {
            $term = $params['search'];
            $query->where(function($q) use ($term) {
                $q->where('title', 'LIKE', "%{$term}%")
                  ->orWhere('artist', 'LIKE', "%{$term}%")
                  ->orWhere('keywords', 'LIKE', "%{$term}%");
            });
        }

        // Category Filter
        if (!empty($params['category_id'])) {
            $query->where('category_id', $params['category_id']);
        }

        // Geometry Filter
        if (!empty($params['geometry'])) {
            $query->where('geometry', $params['geometry']);
        }

        // Color Filters
        if (!empty($params['colors'])) {
            $query->where(function($q) use ($params) {
                foreach ($params['colors'] as $color) {
                    if ($color === 'highkey') $q->orWhere('is_highkey', true);
                    elseif ($color === 'lowkey') $q->orWhere('is_lowkey', true);
                    else $q->orWhere('has_' . $color, true);
                }
            });
        }

        // Sorting Logic
        switch ($params['order']) {
            case 'recently_added':
                $query->orderByDesc('artwork_published_at');
                break;
            case 'oldest_first':
                $query->orderBy('artwork_published_at');
                break;
            case 'best_selling':
                $query->orderBy(DB::raw('best_seller_rank IS NULL'), 'asc')->orderBy('best_seller_rank', 'asc');
                break;
            case 'trending':
                $query->orderBy(DB::raw('trending_rank IS NULL'), 'asc')->orderBy('trending_rank', 'asc');
                break;
            default: // recommended
                // If the list pivot has a sort_order, we might want to use that instead!
                // For now, defaulting to Grade + Date
                $query->orderByDesc('grade');
                break;
        }

        return $query;
    }
}