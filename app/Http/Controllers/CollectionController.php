<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Category; 
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CollectionController extends Controller
{
    /**
     * Helper to group and format collections for the frontend.
     */
    private function formatCategorizedCollections($collections)
    {
        $grouped = $collections->groupBy('category_name');
        $categorized = [];

        foreach ($grouped as $catName => $items) {
            $cleanName = $catName ?: 'General';
            // Use the first item's category_id as the group ID, or fallback to hash
            $firstItem = $items->first();
            $catId = $firstItem->category_id ?? md5($cleanName);
            
            // Create a slug from the name for URL generation
            $slug = Str::slug($cleanName);

            $categorized[] = [
                'category_id'   => $catId,
                'category_name' => $cleanName,
                'slug'          => $slug,          // Used by frontend for links
                'category_slug' => $slug,          // Used by active state checks
                'collections'   => $items->map(fn($c) => [
                    'id'             => $c->pictufy_id,
                    'name'           => $c->name,
                    'slug'           => $c->slug,
                    'thumb'          => $c->thumb,
                    'artworks_count' => $c->artwork_count,
                    'description'    => $c->description
                ])->values()
            ];
        }
        return array_values($categorized);
    }

    /**
     * /collections
     * Shows all categories with horizontal scrolling collections.
     */
    public function index()
    {
        $collections = Collection::orderBy('name')->get();
        $allCategorized = $this->formatCategorizedCollections($collections);

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
        $collections = Collection::orderBy('name')->get();
        $allCategorized = $this->formatCategorizedCollections($collections);

        // Filter to find the requested category
        $activeCategory = collect($allCategorized)->first(function ($cat) use ($category_collection_slug) {
            return $cat['category_slug'] === $category_collection_slug;
        });

        if (!$activeCategory) {
            abort(404, 'Category not found');
        }

        return Inertia::render('Collections', [
            'categorized_collections' => [$activeCategory], // Only show this one
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
        $collection = Collection::where('slug', $collection_slug)
            ->orWhere('pictufy_id', $collection_slug)
            ->firstOrFail();

        $query = $collection->artworks();

        // reuse the filter logic (same as ListController)
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
                
                // --- UPDATED CATEGORY PARSING ---
                if (Str::startsWith($segment, 'cat_')) {
                    $string = substr($segment, 4); // e.g. "illustration_abstract"

                    // Check if it contains an underscore separator for parent_child
                    if (str_contains($string, '_')) {
                        // Split into [parent, child]
                        [$parent, $child] = explode('_', $string, 2);
                        
                        $cat = Category::where('slug', $child)
                            ->where('parent_slug', $parent)
                            ->first();
                    } else {
                        // Fallback for top-level categories or legacy links
                        $cat = Category::where('slug', $string)->first();
                    }

                    if ($cat) {
                        $params['category_id'] = $cat->pictufy_id; 
                    }
                    continue;
                }
                // --------------------------------

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

        // Apply filters to query...
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