<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\CollectionCategory;
use App\Traits\BuildsArtworkQueries;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollectionController extends Controller
{
    use BuildsArtworkQueries;

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

}