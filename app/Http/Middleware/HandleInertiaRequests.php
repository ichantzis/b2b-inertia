<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request; // Make sure Request is imported
use Inertia\Middleware;
use App\Services\PictufyService;
use App\Http\Controllers\CartController;
use Illuminate\Support\Str;

class HandleInertiaRequests extends Middleware
{
    // ... other methods ...

    public function share(Request $request): array
    {
        $pictufyService = app(PictufyService::class);
        $listsData = $pictufyService->getLists();
        $cartData = CartController::getSharedCartData();
        $allCollectionCategoriesWithCollections = [];

        // Explicitly get the flash message
        $loginSuccessMessage = $request->session()->get('login_success_message');


        // Fetch only if not already fetched or if a refresh is needed (caching in service is key)
        $response = $pictufyService->getCollections(['skip_categories' => 0, 'order' => 'alpha']); // alpha for category order

        if (!empty($response['items']) && is_array($response['items'])) {
            $allCollectionCategoriesWithCollections = array_map(function ($category) {
                $collections = [];
                if (isset($category['collections']) && is_array($category['collections'])) {
                    $collections = array_map(function ($collection) {
                        $urlPath = !empty($collection['url']) ? parse_url($collection['url'], PHP_URL_PATH) : '';
                        $collectionSlug = !empty($urlPath) ? basename($urlPath) : Str::slug($collection['name'] ?? 'untitled-collection');
                        return [
                            'id' => $collection['id'] ?? Str::random(10),
                            'name' => html_entity_decode($collection['name'] ?? 'Untitled', ENT_QUOTES | ENT_HTML5),
                            'slug' => $collectionSlug,
                            // Add other collection details if needed by sidebar, e.g., artworks_count
                        ];
                    }, $category['collections']);
                }
                return [
                    'category_id' => $category['category_id'] ?? null,
                    'category_name' => html_entity_decode($category['category_name'] ?? 'Unnamed Category', ENT_QUOTES | ENT_HTML5),
                    'category_slug' => Str::slug(html_entity_decode($category['category_name'] ?? 'untitled-category')), // Generate slug for category
                    'collections' => $collections,
                ];
            }, $response['items']);
        }


        // Merge parent share, then our custom data, then explicitly add flash if needed
        $sharedData = array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'allCollectionCategoriesWithCollections' => $allCollectionCategoriesWithCollections,
            'lists' => collect($listsData['items'] ?? [])->map(function ($list) {
                // ... list mapping ...
                return [
                    'name' => html_entity_decode($list['name']),
                    'list_id' => $list['list_id'],
                    'cover' => $list['cover'],
                    'route' => route('list.filtered', ['list_id' => $list['list_id']]),
                    'icon' => 'pi pi-fw pi-images',
                ];
            })->values()->all(),
            'cartCount' => $cartData['cartCount'],
            'cartItemsPreview' => $cartData['cartItemsPreview'],
        ]);

        // If the login message exists and isn't already in the 'flash' prop from parent::share
        if ($loginSuccessMessage && !isset($sharedData['flash']['login_success_message'])) {
            // Ensure 'flash' key exists before assigning to it
            if (!isset($sharedData['flash'])) {
                $sharedData['flash'] = [];
            }
            $sharedData['flash']['login_success_message'] = $loginSuccessMessage;
        }

        return $sharedData;
    }
}
