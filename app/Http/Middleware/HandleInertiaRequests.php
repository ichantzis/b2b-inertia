<?php

namespace App\Http\Middleware;

use App\Services\PictufyService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $pictufyService = app(PictufyService::class);
        $listsData = $pictufyService->getLists();
        
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'lists' => collect($listsData['items'] ?? [])->map(function ($list) {
                return [
                    'name' => html_entity_decode($list['name']),
                    'list_id' => $list['list_id'],
                    'cover' => $list['cover'],
                    'route' => route('collection.filtered', ['list_id' => $list['list_id']]),
                    'icon' => 'pi pi-fw pi-images',
                ];
            })->values()->all(),
        ]);
    }
}
