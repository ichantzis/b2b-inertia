<?php

namespace App\Http\Controllers;

use App\Models\ArtworkList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\BuildsArtworkQueries;

class ListController extends Controller
{
    use BuildsArtworkQueries;

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

}