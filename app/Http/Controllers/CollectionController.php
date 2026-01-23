<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\CollectionCategory;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CollectionController extends Controller
{
    /**
     * Helper to fetch categories with their collections 
     * and format them for the frontend.
     */
    private function getAllCategorizedData()
    {
        // 1. Fetch all Collection Categories with their related Collections
        // We order categories by name, and collections within them by name.
        $categories = CollectionCategory::with(['collections' => function ($query) {
            $query->orderBy('name');
        }])->get();

        // 2. Transform to the structure expected by Vue
        return $categories->map(function ($cat) {
            return [
                'category_id'   => $cat->pictufy_id,
                'category_name' => $cat->name,
                'slug'          => $cat->slug,
                'category_slug' => $cat->slug, // Used for active state matching
                'collections'   => $cat->collections->map(fn($c) => [
                    'id'             => $c->pictufy_id,
                    'name'           => $c->name,
                    'slug'           => $c->slug,
                    'thumb'          => $c->thumb,
                    'artworks_count' => $c->artwork_count,
                    'description'    => $c->description
                ])->values()
            ];
        })->values(); // Reset keys to ensure JSON array
    }

    /**
     * /collections
     * Shows all categories with horizontal scrolling collections.
     */
    public function index()
    {
        $allCategorized = $this->getAllCategorizedData();

        return Inertia::render('Collections', [
            'categorized_collections' => $allCategorized,
            'all_categories' => $allCategorized, // Pass full list for sidebar
            'is_category_view' => false
        ]);
    }

    /**
     * /collections/category/{slug}
     * Shows a specific category in grid view.
     */
    public function showByCategory($category_collection_slug)
    {
        // We need all categories for the Sidebar
        $allCategorized = $this->getAllCategorizedData();

        // Filter to find the requested category for the Main View
        $activeCategory = $allCategorized->first(function ($cat) use ($category_collection_slug) {
            return $cat['slug'] === $category_collection_slug;
        });

        if (!$activeCategory) {
            abort(404, 'Collection Category not found');
        }

        return Inertia::render('Collections', [
            'categorized_collections' => [$activeCategory], // Only show this one in the main area
            'all_categories' => $allCategorized,            // Keep sidebar full
            'is_category_view' => true                      // Switch layout to grid
        ]);
    }

    /**
     * /collection/{slug}
     * Shows a single collection's artworks.
     */
    public function show(Request $request, $collection_slug, $filters = null)
    {
        // Find collection by slug or ID
        $collection = Collection::where('slug', $collection_slug)
            ->orWhere('pictufy_id', $collection_slug)
            ->firstOrFail();

        $query = $collection->artworks();

        // Apply filters (Sort, Color, Geometry, etc.)
        $this->buildFilteredQuery($query, $filters, $request);

        $artworks = $query->paginate(30)->withQueryString();

        return Inertia::render('Artworks', [
            'artworks' => $artworks->items(),
            'collectionId' => (string) $collection->pictufy_id,
            'collectionName' => $collection->name,
            'collectionCover' => $collection->thumb,
            'collectionDescription' => $collection->description,
            'collectionSlug' => $collection_slug,
            'currentSearchTerm' => $request->input('search'),
            'filters' => $filters ? explode('/', $filters) : [],
            'nextPage' => $artworks->hasMorePages() ? $artworks->currentPage() + 1 : null,
        ]);
    }

    /**
     * Helper to apply filters to the artwork query.
     */
    private function buildFilteredQuery($query, $filters, Request $request)
    {
        $params = [
            'order' => $request->input('order', 'recommended'),
            'search' => $request->input('search'),
            'category_id' => null,
            'geometry' => [],
            'colors' => [],
        ];

        if ($filters) {
            $segments = explode('/', $filters);
            foreach ($segments as $segment) {
                // Order
                if (in_array($segment, ['recommended', 'recently_added', 'best_selling', 'trending', 'oldest_first'])) {
                    $params['order'] = $segment;
                    continue;
                }
                
                // Category parsing
                if (Str::startsWith($segment, 'cat_')) {
                    $string = substr($segment, 4);
                    if (str_contains($string, '_')) {
                        [$parent, $child] = explode('_', $string, 2);
                        $cat = Category::where('slug', $child)->where('parent_slug', $parent)->first();
                    } else {
                        $cat = Category::where('slug', $string)->first();
                    }

                    if ($cat) {
                        $params['category_id'] = $cat->pictufy_id; 
                    }
                    continue;
                }

                // Geometry
                if (in_array($segment, ['horizontal', 'vertical', 'square', 'panorama'])) {
                    $params['geometry'][] = $segment;
                    continue;
                }
                // Colors
                if (in_array($segment, ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'lilac', 'pink', 'highkey', 'lowkey'])) {
                    $params['colors'][] = $segment;
                    continue;
                }
            }
        }

        // Apply filters
        if ($params['search']) {
            $term = $params['search'];
            $query->where(function($q) use ($term) {
                $q->where('title', 'LIKE', "%{$term}%")
                  ->orWhere('artist', 'LIKE', "%{$term}%")
                  ->orWhere('keywords', 'LIKE', "%{$term}%");
            });
        }
        if ($params['category_id']) $query->where('category_id', $params['category_id']);
        if (!empty($params['geometry'])) $query->whereIn('geometry', $params['geometry']);
        if (!empty($params['colors'])) {
            $query->where(function ($q) use ($params) {
                foreach ($params['colors'] as $color) {
                    if ($color === 'highkey') $q->orWhere('is_highkey', true);
                    elseif ($color === 'lowkey') $q->orWhere('is_lowkey', true);
                    else $q->orWhere('has_' . $color, true);
                }
            });
        }
        
        switch ($params['order']) {
            case 'recently_added': $query->orderByDesc('artwork_published_at'); break;
            case 'oldest_first': $query->orderBy('artwork_published_at'); break;
            default: $query->orderByDesc('grade'); break;
        }
    }
}