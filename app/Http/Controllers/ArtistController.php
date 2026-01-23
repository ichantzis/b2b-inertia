<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use App\Models\Category;
use App\Services\PictufyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ArtistController extends Controller
{

    protected $pictufy;

    // <--- 2. INJECT SERVICE
    public function __construct(PictufyService $pictufy)
    {
        $this->pictufy = $pictufy;
    }
    /**
     * Helper to format artist data for the frontend.
     * Ensures we send 'username' (needed by frontend) and 'slug' (needed by route).
     */
    private function formatArtist($artist)
    {
        return [
            'id' => $artist->pictufy_id,
            'name' => $artist->name,
            'username' => $artist->username,
            'slug' => $artist->username, // Use username as the slug
            'profile_picture' => $artist->profile_picture,
            'biography' => $artist->biography,
            'artist_type' => $artist->artist_type,
            'country' => $artist->country,
            'artwork_count' => $artist->artwork_count ?? 0,
        ];
    }

    public function index(Request $request)
    {
        $order = $request->input('order', 'alpha');

        $artists = Artist::where('artwork_count', '>=', 10)
            ->orderBy('name')
            ->get()
            ->map(fn($a) => $this->formatArtist($a));

        return Inertia::render('artists/Index', [
            'artists' => $artists,
        ]);
    }

    public function overview()
    {
        // 1. Featured (Top 15 Trending)
        $featured = Artist::where('artwork_count', '>=', 10)
            ->orderByRaw('trending_rank IS NULL ASC, trending_rank ASC')
            ->take(15)->get()
            ->map(fn($a) => $this->formatArtist($a));

        // 2. Trending (Top 40)
        $trending = Artist::where('artwork_count', '>=', 10)
            ->orderByRaw('trending_rank IS NULL ASC, trending_rank ASC')
            ->take(40)->get()
            ->map(fn($a) => $this->formatArtist($a));

        // 3. Biggest (Top 40 by count)
        $biggest = Artist::where('artwork_count', '>=', 10)
            ->orderByDesc('artwork_count')
            ->take(40)->get()
            ->map(fn($a) => $this->formatArtist($a));

        $rows = [
            ['title' => 'Featured Artists', 'items' => $featured],
            ['title' => 'Trending Now', 'items' => $trending],
            ['title' => 'Biggest Collections', 'items' => $biggest],
        ];

        return Inertia::render('artists/Overview', [
            'activeTab' => 'overview',
            'rows' => $rows,
            'gridItems' => []
        ]);
    }

    public function illustrators()
    {
        return $this->renderByType('Illustrator', 'illustrators');
    }

    public function photographers()
    {
        return $this->renderByType('Photographer', 'photographers');
    }

    public function byCountry()
    {
        $artists = Artist::where('artwork_count', '>=', 10)
            ->orderBy('country')
            ->get();

        $grouped = $artists->groupBy(fn($item) => $item->country ?: 'International');

        // Sort keys alphabetically
        $grouped = $grouped->sortKeys();

        $rows = [];
        foreach ($grouped as $country => $items) {
            $rows[] = [
                'title' => $country,
                'items' => $items->map(fn($a) => $this->formatArtist($a))->values()
            ];
        }

        return Inertia::render('artists/Overview', [
            'activeTab' => 'by-country',
            'rows' => $rows,
            'gridItems' => []
        ]);
    }

    public function show(Request $request, $artist_slug, $filters = null)
    {
        // REMOVED 'slug' check to fix SQL error
        // We assume 'username' is the slug in your database
        $artist = Artist::where('username', $artist_slug)
            ->orWhere('pictufy_id', $artist_slug)
            ->firstOrFail();

        // <---  LAZY LOAD BIOGRAPHY IF MISSING --->
        if (empty($artist->biography)) {
            try {
                // Fetch details from API (which includes biography_text)
                $apiData = $this->pictufy->getArtist($artist->pictufy_id);

                // Extract text safely
                $bioText = $apiData['items'][0]['biography_text'] ?? null;

                if ($bioText) {
                    // Save to Database so we don't need to ask API next time
                    $artist->biography = $bioText;
                    $artist->save();
                }
            } catch (\Exception $e) {
                // Determine if you want to log error or ignore
                // \Log::error("Could not fetch bio for artist " . $artist->id);
            }
        }
        // <--- END LAZY LOAD --->

        $query = $artist->artworks();

        // Use the shared filter logic
        $this->buildFilteredQuery($query, $filters, $request);

        $artworks = $query->paginate(30)->withQueryString();

        return Inertia::render('Artworks', [
            'artworks' => $artworks->items(),
            'collectionId' => (string) $artist->pictufy_id,
            'collectionName' => $artist->name,
            'collectionCover' => $artist->profile_picture,
            'collectionDescription' => $artist->biography,
            'isArtistPage' => true,
            // Pass the username as the slug for the sidebar URL generation
            'collectionSlug' => $artist->username ?? $artist_slug,
            'currentSearchTerm' => $request->input('search'),
            'filters' => $filters ? explode('/', $filters) : [],
            'nextPage' => $artworks->hasMorePages() ? $artworks->currentPage() + 1 : null,
        ]);
    }

    // --- Helpers ---

    private function renderByType($typeKeyword, $activeTab)
    {
        $artists = Artist::where('artwork_count', '>=', 10)
            ->where('artist_type', 'LIKE', "%$typeKeyword%")
            ->orderBy('artist_type')
            ->get();

        $grouped = $artists->groupBy(function ($item) use ($typeKeyword) {
            // "Vintage Illustrator" -> "Vintage"
            $sub = trim(str_ireplace($typeKeyword, '', $item->artist_type));
            return $sub ?: 'General';
        });

        $rows = [];
        foreach ($grouped as $sub => $items) {
            $rows[] = [
                'title' => $sub,
                'items' => $items->map(fn($a) => $this->formatArtist($a))->values()
            ];
        }

        return Inertia::render('artists/Overview', [
            'activeTab' => $activeTab,
            'rows' => $rows,
            'gridItems' => []
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
                if (in_array($segment, ['recommended', 'recently_added', 'best_selling', 'trending', 'oldest_first'])) {
                    $params['order'] = $segment;
                    continue;
                }

                // Category Parsing
                if (Str::startsWith($segment, 'cat_')) {
                    $slugPart = substr($segment, 4);
                    // Try exact match
                    $cat = Category::where('slug', $slugPart)->first();
                    // Try parent_child match
                    if (!$cat && str_contains($slugPart, '_')) {
                        [$parent, $child] = explode('_', $slugPart, 2);
                        $cat = Category::where('slug', $child)->where('parent_slug', $parent)->first();
                    }
                    if ($cat) $params['category_id'] = $cat->pictufy_id;
                    continue;
                }

                if (in_array($segment, ['horizontal', 'vertical', 'square', 'panorama'])) {
                    $params['geometry'][] = $segment;
                    continue;
                }
                if (in_array($segment, ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'lilac', 'pink', 'highkey', 'lowkey'])) {
                    $params['colors'][] = $segment;
                    continue;
                }
            }
        }

        if ($params['search']) {
            $term = $params['search'];
            $query->where(function ($q) use ($term) {
                $q->where('title', 'LIKE', "%{$term}%")
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
            case 'recently_added':
                $query->orderByDesc('artwork_published_at');
                break;
            case 'oldest_first':
                $query->orderBy('artwork_published_at');
                break;
            case 'trending':
                $query->orderByRaw('trending_rank IS NULL ASC, trending_rank ASC');
                break;
            default:
                $query->orderByDesc('grade');
                break;
        }
    }
}
