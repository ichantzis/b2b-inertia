<?php

namespace App\Http\Controllers;

use App\Models\ArtworkList;
use App\Models\Category; // Import Category
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ListController extends Controller
{
    public function index()
    {
        return Inertia::render('Lists', [
            'lists' => ArtworkList::orderByDesc('last_change')->get()
        ]);
    }

    // --- UPDATED SHOW METHOD ---
    public function show(Request $request, $slug, $filters = null)
    {
        $list = ArtworkList::where('slug', $slug)
            ->orWhere('pictufy_id', $slug)
            ->firstOrFail();

        // 1. Start relation
        $query = $list->artworks(); 

        // 2. Apply Filters
        $this->buildFilteredQuery($query, $filters, $request);

        // 3. Paginate
        $artworks = $query->paginate(30)->withQueryString();

        return Inertia::render('Artworks', [
            'artworks' => $artworks->items(),
            'collectionId' => $list->id,
            'collectionName' => $list->name,
            'isListPage' => true, 
            'collectionSlug' => $slug, // Important for FilterSidebar URL building
            'currentSearchTerm' => $request->input('search'),
            'filters' => $filters ? explode('/', $filters) : [],
            'nextPage' => $artworks->hasMorePages() ? $artworks->currentPage() + 1 : null,
        ]);
    }

    /**
     * Shared logic to parse URL filters and Request params
     * (Identical to CollectionController logic)
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