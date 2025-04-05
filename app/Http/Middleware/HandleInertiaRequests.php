<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request; // Make sure Request is imported
use Inertia\Middleware;
use App\Services\PictufyService;
use App\Http\Controllers\CartController;

class HandleInertiaRequests extends Middleware
{
    // ... other methods ...

    public function share(Request $request): array
    {
        $pictufyService = app(PictufyService::class);
        $listsData = $pictufyService->getLists();
        $cartData = CartController::getSharedCartData();

        // Explicitly get the flash message
        $loginSuccessMessage = $request->session()->get('login_success_message');

        // Merge parent share, then our custom data, then explicitly add flash if needed
        $sharedData = array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'lists' => collect($listsData['items'] ?? [])->map(function ($list) {
                 // ... list mapping ...
                 return [
                     'name' => html_entity_decode($list['name']),
                     'list_id' => $list['list_id'],
                     'cover' => $list['cover'],
                     'route' => route('collection.filtered', ['list_id' => $list['list_id']]),
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