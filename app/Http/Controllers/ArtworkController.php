<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ArtworkController extends Controller
{
    /**
     * Handles the main /artworks page and /artworks/{filters}
     * Formerly: PictufyController@filteredArtworks
     */
    public function index(Request $request, $filters = null)
    {
        // 1. Parse Parameters
        $params = $this->parseFilters($filters, $request);

        // 2. Build Query
        $query = $this->buildQuery($params);

        // 3. Fetch Data
        $artworks = $query->paginate($params['per_page'])->withQueryString();

        return Inertia::render('Artworks', [
            'artworks' => $artworks->items(), // Inertia handles pagination object differently usually, but matching your structure
            'filters' => $filters ? explode('/', $filters) : [],
            'currentSearchTerm' => $params['search'],
            'collectionName' => 'Artworks',
            'nextPage' => $artworks->hasMorePages() ? $artworks->currentPage() + 1 : null,
        ]);
    }

    /**
     * AJAX Endpoint for Infinite Scroll
     * Formerly: PictufyController@fetchData
     */
    public function fetchData(Request $request)
    {
        $filters = $request->input('filters');

        // Merge request inputs with parsed path filters
        $params = $this->parseFilters($filters, $request);

        // Overrides from direct AJAX params (like artist_id or collection_id passed explicitly)
        if ($request->has('collection_id')) $params['collection_id'] = $request->input('collection_id');
        if ($request->has('artist_id')) $params['artist_id'] = $request->input('artist_id');

        $query = $this->buildQuery($params);

        $artworks = $query->paginate($params['per_page']);

        return response()->json([
            'artworks' => $artworks->items(),
            'nextPage' => $artworks->hasMorePages() ? $artworks->currentPage() + 1 : null,
        ]);
    }

    /**
     * Single Artwork Page
     * Formerly: PictufyController@artworkDetails
     */
    public function show($id, $slug = null)
    {
        // Find by local ID or Pictufy ID
        $artwork = Artwork::where('id', $id)
            ->orWhere('pictufy_id', $id)
            ->firstOrFail();

        // SEO Redirect logic
        $correctSlug = Str::slug($artwork->title);
        if ($slug !== $correctSlug) {
            return redirect()->route('artworks.show', ['id' => $artwork->id, 'slug' => $correctSlug], 301);
        }

        return Inertia::render('ArtworkDetails', [
            'artwork' => $artwork,
            // Pass settings if needed, e.g. from a SettingsService
            'requireLoginForPrices' => false, // Replace with your Settings logic
        ]);
    }

    /**
     * Related Artworks (AJAX)
     * Formerly: PictufyController@getRelatedContent
     */
    public function getRelatedContent($id)
    {
        $artwork = Artwork::findOrFail($id);

        // 1. Related: Same Category + Matching Keywords
        // We pick the first keyword from the stored CSV string
        $firstKeyword = explode(',', $artwork->keywords)[0] ?? null;

        $related = Artwork::where('category_id', $artwork->category_id)
            ->where('id', '!=', $artwork->id)
            ->when($firstKeyword, function ($q) use ($firstKeyword) {
                $q->where('keywords', 'LIKE', "%$firstKeyword%");
            })
            ->take(8)
            ->get();

        // 2. You May Like: Trending (Highest Rank)
        $youMayLike = Artwork::where('id', '!=', $artwork->id)
            ->whereNotNull('trending_rank')
            ->orderBy('trending_rank', 'asc')
            ->take(4)
            ->get();

        return response()->json([
            'related' => $related,
            'youMayLike' => $youMayLike
        ]);
    }

    // --- Helper Methods ---

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
                // Order
                if (in_array($segment, ['recommended', 'recently_added', 'best_selling', 'trending', 'oldest_first'])) {
                    $params['order'] = $segment;
                    continue;
                }
                // Category (cat_slug)
                if (str_starts_with($segment, 'cat_')) {
                    // Extract slug: cat_photography -> photography
                    // You might need smarter logic if your slugs have underscores, 
                    // but usually slugs use dashes.
                    // Let's assume the slug is everything after 'cat_'
                    // Or match your specific regex logic from PictufyService
                    $slug = substr($segment, 4);

                    // DB Lookup for ID
                    $category = Category::where('slug', $slug)->first();
                    if ($category) $params['category_id'] = $category->pictufy_id; // or local ID
                    continue;
                }
                // Geometry
                if (in_array($segment, ['horizontal', 'vertical', 'square', 'panorama'])) {
                    $params['geometry'] = $segment;
                    continue;
                }
                // Colors
                if (in_array($segment, ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'lilac', 'pink', 'highkey', 'lowkey'])) {
                    $params['colors'][] = $segment;
                    continue;
                }
            }
        }
        return $params;
    }

    private function buildQuery($params)
    {
        $query = Artwork::query();

        // Search
        if (!empty($params['search'])) {
            $term = $params['search'];
            $query->where(function ($q) use ($term) {
                $q->where('title', 'LIKE', "%{$term}%")
                    ->orWhere('artist', 'LIKE', "%{$term}%")
                    ->orWhere('keywords', 'LIKE', "%{$term}%");
            });
        }

        // Category
        if (!empty($params['category_id'])) {
            $query->where('category_id', $params['category_id']);
        }

        // Geometry
        if (!empty($params['geometry'])) {
            $query->where('geometry', $params['geometry']);
        }

        // Colors (OR logic for multiple colors usually, or AND depending on needs)
        if (!empty($params['colors'])) {
            $query->where(function ($q) use ($params) {
                foreach ($params['colors'] as $color) {
                    if ($color === 'highkey') $q->orWhere('is_highkey', true);
                    elseif ($color === 'lowkey') $q->orWhere('is_lowkey', true);
                    else $q->orWhere('has_' . $color, true);
                }
            });
        }

        // Collection (if pivot exists)
        if (!empty($params['collection_id'])) {
            $query->whereHas('collections', function ($q) use ($params) {
                $q->where('collections.pictufy_id', $params['collection_id']);
            });
        }

        // Filter by List (via Pivot)
        if (!empty($params['list_id'])) {
            $query->whereHas('artworksLists', function ($q) use ($params) { // Προσοχή στη σχέση στο Artwork Model
                $q->where('artwork_lists.pictufy_id', $params['list_id']);
            });
        }

        // Artist
        if (!empty($params['artist_id'])) {
            $query->where('artist_id', $params['artist_id']);
        }

        // Ordering
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
                $query->orderByDesc('grade');
                break;
        }

        return $query;
    }
}
