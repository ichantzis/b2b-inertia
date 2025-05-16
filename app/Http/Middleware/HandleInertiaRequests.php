<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request; // Make sure Request is imported
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy; // Ensure Ziggy is imported
use App\Services\PictufyService; // Your existing service
use App\Http\Controllers\CartController; // Your existing controller
use Illuminate\Support\Str; // Your existing Str usage

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app'; // Or your actual root Blade file

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        // Your existing shared data logic
        $pictufyService = app(PictufyService::class);
        $listsData = $pictufyService->getLists();
        $cartData = CartController::getSharedCartData();
        $allCollectionCategoriesWithCollections = [];

        // Fetch collections (your existing logic)
        $response = $pictufyService->getCollections(['skip_categories' => 0, 'order' => 'alpha']);
        if (!empty($response['items']) && is_array($response['items'])) {
            $allCollectionCategoriesWithCollections = array_map(function ($category) {
                // ... your existing mapping ...
                $collections = [];
                if (isset($category['collections']) && is_array($category['collections'])) {
                    $collections = array_map(function ($collection) {
                        $urlPath = !empty($collection['url']) ? parse_url($collection['url'], PHP_URL_PATH) : '';
                        $collectionSlug = !empty($urlPath) ? basename($urlPath) : Str::slug($collection['name'] ?? 'untitled-collection');
                        return [
                            'id' => $collection['id'] ?? Str::random(10),
                            'name' => html_entity_decode($collection['name'] ?? 'Untitled', ENT_QUOTES | ENT_HTML5),
                            'slug' => $collectionSlug,
                        ];
                    }, $category['collections']);
                }
                return [
                    'category_id' => $category['category_id'] ?? null,
                    'category_name' => html_entity_decode($category['category_name'] ?? 'Unnamed Category', ENT_QUOTES | ENT_HTML5),
                    'category_slug' => Str::slug(html_entity_decode($category['category_name'] ?? 'untitled-category')),
                    'collections' => $collections,
                ];
            }, $response['items']);
        }

        // Consolidate flash messages
        $flashMessages = [];
        if ($request->session()->has('success')) {
            $flashMessages['success'] = $request->session()->get('success');
        }
        if ($request->session()->has('error')) {
            $flashMessages['error'] = $request->session()->get('error');
        }
        // Add other flash message keys if you use them (e.g., 'warning', 'info')
        // Example of your existing specific flash message:
        if ($request->session()->has('login_success_message')) {
            $flashMessages['login_success_message'] = $request->session()->get('login_success_message');
        }


        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    // Share only necessary user fields
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role, // If you need to check role on frontend (use with caution)
                ] : null,
            ],
            'allCollectionCategoriesWithCollections' => $allCollectionCategoriesWithCollections,
            'lists' => collect($listsData['items'] ?? [])->map(function ($list) {
                return [
                    'name' => html_entity_decode($list['name']),
                    'list_id' => $list['list_id'],
                    'cover' => $list['cover'],
                    'route' => route('list.filtered', ['list_id' => $list['list_id']]),
                    'icon' => 'pi pi-fw pi-images', // Example icon
                ];
            })->values()->all(),
            'cartCount' => $cartData['cartCount'],
            'cartItemsPreview' => $cartData['cartItemsPreview'],
            'flash' => $flashMessages, // Pass all collected flash messages under the 'flash' key,
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(), // Current full URL
                'current_route_name' => $request->route()->getName(), // Alternative if Ziggy object isn't enough
            ],
        ]);
    }
}