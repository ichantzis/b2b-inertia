<?php

namespace App\Http\Middleware;

use App\Models\ArtworkList;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;
use App\Http\Controllers\CartController;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Fetch Cart Data using the static helper we created
        $cartData = CartController::getSharedCartData();

        return [
            ...parent::share($request),
            
            'auth' => [
                'user' => $request->user(),
            ],
            
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],

            'cartCount' => $cartData['cartCount'],
            'cartItemsPreview' => $cartData['cartItemsPreview'],

            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(), // Current full URL
                'current_route_name' => $request->route()->getName(), // Alternative if Ziggy object isn't enough
            ],

            // --- CHANGED: Fetch from DB (Cached) instead of API ---
            'global_data' => Cache::remember('global_menu_data', 3600, function () {
                return [
                    'categories' => \App\Models\Category::orderBy('name')->get()->map(function ($cat) {
                        return [
                            'id' => $cat->pictufy_id,
                            'name' => $cat->name,
                            'slug' => $cat->slug,
                            'parent_slug' => $cat->parent_slug,
                        ];
                    }),

                    // --- UPDATED LISTS LOGIC ---
                    'lists' => \App\Models\ArtworkList::orderBy('sort_order')->get()->map(function ($list) {
                        return [
                            'id' => $list->pictufy_id,
                            'name' => $list->name,
                            'slug' => $list->slug,
                            'cover' => $list->cover, // Pass the cover image
                            'sort_order' => $list->sort_order, // Include sort_order for sorting in the frontend
                        ];
                    }),
                ];
            }),
        ];
    }
}