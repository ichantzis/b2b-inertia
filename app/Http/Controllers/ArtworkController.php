<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
use App\Models\Artist;
use App\Services\SettingsService;
use App\Services\PictufyService;
use App\Traits\BuildsArtworkQueries;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ArtworkController extends Controller
{
    protected $settings;
    protected $pictufy;

    use BuildsArtworkQueries;

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
        $query = Artwork::query()->where('grade', '>=', 1); // Only published artworks

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

        // Εάν δεν βρεθεί το έργο, επιστρέφουμε άδεια arrays για να μην "σπάσει" το Vue
        if (!$artwork) {
            return response()->json([
                'moreFromArtist' => [],
                'youMayAlsoLike' => []
            ]);
        }

        // 1. More from this Artist: Ίδιος καλλιτέχνης, τυχαία σειρά, όριο 4 έργα
        $moreFromArtist = Artwork::where('artist_id', $artwork->artist_id)
            ->where('id', '!=', $artwork->id) // Εξαιρούμε το έργο που ήδη βλέπει ο χρήστης
            ->inRandomOrder()
            ->take(4)
            ->get();

        // 2. You May Also Like: Ίδια κατηγορία, τυχαία σειρά, όριο 21 έργα (για το Carousel)
        $youMayAlsoLike = Artwork::where('category_id', $artwork->category_id)
            ->where('id', '!=', $artwork->id)
            ->inRandomOrder()
            ->take(21)
            ->get();

        return response()->json([
            'moreFromArtist' => $moreFromArtist,
            'youMayAlsoLike' => $youMayAlsoLike
        ]);
    }
}
