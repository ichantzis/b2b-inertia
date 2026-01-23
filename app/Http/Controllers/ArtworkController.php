<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
use App\Models\Artist;
use App\Models\Category;
use App\Services\SettingsService;
use App\Services\PictufyService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ArtworkController extends Controller
{
    protected $settings;
    protected $pictufy;

    public function __construct(SettingsService $settings, PictufyService $pictufy)
    {
        $this->settings = $settings;
        $this->pictufy = $pictufy;
    }

    /**
     * Main Shop Page (Equivalent to PictufyController@filteredArtworks)
     */
    public function index(Request $request, $filters = null)
    {
        $query = Artwork::query();

        // Apply shared filter logic
        $this->buildFilteredQuery($query, $filters, $request);

        $artworks = $query->paginate($request->input('per_page', 30))->withQueryString();

        return Inertia::render('Artworks', [
            'artworks' => $artworks->items(),
            'filters' => $filters ? explode('/', $filters) : [],
            'currentSearchTerm' => $request->input('search'),
            'collectionName' => 'Artworks',
            'nextPage' => $artworks->hasMorePages() ? $artworks->currentPage() + 1 : null,
        ]);
    }

    /**
     * Infinite Scroll / Ajax Endpoint (Equivalent to PictufyController@fetchData)
     */
    public function fetchData(Request $request)
    {
        $query = Artwork::query();

        // 1. Handle Contexts (Collection, List, Artist)
        if ($request->has('collection_id')) {
            $query->whereHas('collections', fn($q) => $q->where('collections.pictufy_id', $request->input('collection_id')));
        }
        if ($request->has('list_id')) {
            $query->whereHas('artworkLists', fn($q) => $q->where('artwork_lists.id', $request->input('list_id')));
        }
        if ($request->has('artist_id')) {
            $query->where('artist_id', $request->input('artist_id'));
        }

        // 2. Apply Filters & Search
        $this->buildFilteredQuery($query, $request->input('filters'), $request);

        // 3. Paginate
        $artworks = $query->paginate($request->input('per_page', 30));

        return response()->json([
            'artworks' => $artworks->items(),
            'nextPage' => $artworks->hasMorePages() ? $artworks->currentPage() + 1 : null,
        ]);
    }

    /**
     * Single Artwork Page (Equivalent to PictufyController@artworkDetails)
     */
    public function show($id, $slug = null)
    {
        $artwork = Artwork::where('id', $id)->orWhere('pictufy_id', $id)->with('relatedCategory')->firstOrFail();
        // Fetch interiors from Pictufy API temporarily
        $artworkResponse = $this->pictufy->getArtworkDetails($id);
        $artwork->interiors = $artworkResponse['items'][0]['urls']['interiors'] ?? [];

        // SEO Redirect
        $correctSlug = Str::slug($artwork->title);
        if ($slug !== $correctSlug && $slug !== null) {
            return redirect()->route('artwork.details', ['id' => $artwork->id, 'slug' => $correctSlug], 301);
        }

        // Add artist_username for frontend linking
        $artist = Artist::where('pictufy_id', $artwork->artist_id)->first();
        if ($artist) {
            $artwork->artist_username = $artist->username ?? Str::slug($artist->name);
        }

        // Map 'parent_slug' to 'artwork_type' for the frontend
        if ($artwork->relatedCategory) {
            $artwork->artwork_type = $artwork->relatedCategory->parent_slug;
            // Ensure category_slug is also accessible if needed
            $artwork->category_slug = $artwork->relatedCategory->slug; 
        }

        // Settings
        $requireLogin = $this->settings->get('require_login_for_prices', false);
        $pricingConfig = $this->settings->get('pricing_config', []);

        return Inertia::render('ArtworkDetails', [
            'artwork' => $artwork,
            'requireLoginForPrices' => $requireLogin,
            'pricingConfig' => $pricingConfig
        ]);
    }

    /**
     * Related Content (Equivalent to PictufyController@getRelatedContent)
     */
    public function getRelatedContent($id)
    {
        $artwork = Artwork::where('pictufy_id', $id)->first();
        if (!$artwork) return response()->json(['related' => [], 'youMayLike' => []]);

        // 1. Related: Same Category + First Keyword
        $relatedQuery = Artwork::where('category_id', $artwork->category_id)
            ->where('id', '!=', $artwork->id);

        $keywords = explode(',', $artwork->keywords ?? '');
        $firstKeyword = trim($keywords[0] ?? '');

        if ($firstKeyword) {
            $relatedQuery->where('keywords', 'LIKE', "%$firstKeyword%");
        }

        $related = $relatedQuery->take(12)->get(); // Fetch 12 like API

        // 2. You May Like: Trending (Highest Rank)
        $youMayLike = Artwork::where('id', '!=', $artwork->id)
            ->orderByRaw('trending_rank IS NULL ASC, trending_rank ASC') // Put NULLs last
            ->take(6)
            ->get();

        return response()->json([
            'related' => $related,
            'youMayLike' => $youMayLike
        ]);
    }

    /**
     * Shared Filter Logic (The helper function we discussed)
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

        // --- A. Parse URL Filters ---
        if ($filters) {
            $segments = explode('/', $filters);
            foreach ($segments as $segment) {
                // Order
                if (in_array($segment, ['recommended', 'recently_added', 'best_selling', 'trending', 'oldest_first'])) {
                    $params['order'] = $segment;
                    continue;
                }

                // Category (Robust Parent/Child Parsing)
                if (Str::startsWith($segment, 'cat_')) {
                    $slugPart = substr($segment, 4); // Remove 'cat_'

                    // 1. Try finding by slug directly
                    $cat = Category::where('slug', $slugPart)->first();

                    // 2. If not found, try split (parent_child)
                    if (!$cat && str_contains($slugPart, '_')) {
                        [$parent, $child] = explode('_', $slugPart, 2);
                        $cat = Category::where('slug', $child)
                            ->where('parent_slug', $parent)
                            ->first();
                    }

                    if ($cat) $params['category_id'] = $cat->pictufy_id;
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

        // --- B. Apply to Query ---

        // Search
        if ($params['search']) {
            $term = $params['search'];
            $query->where(function ($q) use ($term) {
                $q->where('title', 'LIKE', "%{$term}%")
                    ->orWhere('artist', 'LIKE', "%{$term}%")
                    ->orWhere('keywords', 'LIKE', "%{$term}%");
            });
        }

        // Category
        if ($params['category_id']) {
            $query->where('category_id', $params['category_id']);
        }

        // Geometry
        if (!empty($params['geometry'])) {
            $query->whereIn('geometry', $params['geometry']);
        }

        // Colors
        if (!empty($params['colors'])) {
            $query->where(function ($q) use ($params) {
                foreach ($params['colors'] as $color) {
                    if ($color === 'highkey') $q->orWhere('is_highkey', true);
                    elseif ($color === 'lowkey') $q->orWhere('is_lowkey', true);
                    else $q->orWhere('has_' . $color, true);
                }
            });
        }

        // Sorting
        switch ($params['order']) {
            case 'recently_added':
                $query->orderByDesc('artwork_published_at');
                break;
            case 'oldest_first':
                $query->orderBy('artwork_published_at');
                break;
            case 'trending':
                $query->orderByRaw('trending_rank IS NULL ASC, trending_rank ASC');
                break;
            case 'best_selling':
                $query->orderByRaw('best_seller_rank IS NULL ASC, best_seller_rank ASC');
                break;
            default:
                $query->orderByDesc('grade');
                break;
        }
    }
}
