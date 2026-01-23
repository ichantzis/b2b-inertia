<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Category;

trait BuildsArtworkQueries
{
    /**
     * Shared logic to parse URL filters and Request params
     * Applies filters to the Artwork query builder.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|null $filters
     * @param Request $request
     * @return void
     */
    protected function buildFilteredQuery($query, $filters, Request $request)
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
            case 'recommended':
            default:
                // Default: Recommended rank or Fallback to Grade
                $query->orderByRaw('recommended_rank IS NULL ASC, recommended_rank ASC')
                      ->orderByDesc('grade');
                break;
        }
    }
}