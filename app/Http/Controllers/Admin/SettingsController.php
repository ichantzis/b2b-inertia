<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    protected $settings;

    public function __construct(SettingsService $settings)
    {
        $this->settings = $settings;
    }

    public function index()
    {
        // New structure matching your Vue component
        // converting {'40x60': 144} to [['size' => '40x60', 'price' => 144], ...]
        $defaultPricing = [
            'canvas_framed' => [
                ['size' => '40x60', 'price' => 144],
                ['size' => '50x70', 'price' => 180],
                ['size' => '60x90', 'price' => 264],
                ['size' => '70x100', 'price' => 288],
                ['size' => '80x120', 'price' => 348],
                ['size' => '100x140', 'price' => 408],
                ['size' => '100x150', 'price' => 504],
                ['size' => '120x160', 'price' => 588],
                ['size' => '120x180', 'price' => 624],
                ['size' => '50x50', 'price' => 150],
                ['size' => '70x70', 'price' => 276],
                ['size' => '100x100', 'price' => 372],
                ['size' => '120x120', 'price' => 504],
            ],
            'canvas_noframe' => [
                ['size' => '40x60', 'price' => 96],
                ['size' => '50x70', 'price' => 120],
                ['size' => '60x90', 'price' => 180],
                ['size' => '70x100', 'price' => 198],
                ['size' => '80x120', 'price' => 228],
                ['size' => '100x140', 'price' => 276],
                ['size' => '100x150', 'price' => 324],
                ['size' => '50x50', 'price' => 96],
                ['size' => '70x70', 'price' => 180],
                ['size' => '100x100', 'price' => 240],
            ],
            'poster_framed' => [ // Maps to your 'poster' key
                ['size' => '30x40', 'price' => 72],
                ['size' => '40x60', 'price' => 96],
                ['size' => '50x70', 'price' => 132],
                ['size' => '60x80', 'price' => 156],
                ['size' => '70x100', 'price' => 204],
                ['size' => '80x120', 'price' => 288],
                ['size' => '100x140', 'price' => 432],
                ['size' => '50x50', 'price' => 102],
                ['size' => '60x60', 'price' => 132],
                ['size' => '70x70', 'price' => 168],
                ['size' => '100x100', 'price' => 288],
                ['size' => '120x120', 'price' => 396],
            ]
        ];

        return Inertia::render('dashboard/Settings', [
            'settings' => [
                'admin_notification_email' => $this->settings->get('admin_notification_email', config('mail.from.address')),
                'require_login_for_prices' => $this->settings->get('require_login_for_prices', false),
                'allow_public_registration' => $this->settings->get('allow_public_registration', false),
                'pricing_config' => $this->settings->get('pricing_config', $defaultPricing),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'admin_notification_email' => 'required|email',
            'require_login_for_prices' => 'boolean',
            'allow_public_registration' => 'boolean',
            'pricing_config' => 'array',
            'pricing_config.canvas_framed.*.size' => 'required|string',
            'pricing_config.canvas_framed.*.price' => 'required|numeric|min:0',
            'pricing_config.canvas_noframe.*.size' => 'required|string',
            'pricing_config.canvas_noframe.*.price' => 'required|numeric|min:0',
            'pricing_config.poster_framed.*.size' => 'required|string',
            'pricing_config.poster_framed.*.price' => 'required|numeric|min:0',
        ]);

        // SORTING: Note the '&' before $items to modify by reference
        if (isset($validated['pricing_config'])) {
            foreach ($validated['pricing_config'] as $key => &$items) {
                if (is_array($items)) {
                    usort($items, function ($a, $b) {
                        // 1. Normalize Size String just in case
                        $sizeA = strtolower(trim($a['size']));
                        $sizeB = strtolower(trim($b['size']));
                        
                        // Parse dimensions
                        $partsA = array_map('intval', explode('x', $sizeA));
                        $partsB = array_map('intval', explode('x', $sizeB));
                        
                        // Fallback for bad data
                        if (count($partsA) < 2) return 1;
                        if (count($partsB) < 2) return -1;
                        
                        // Calculate Area
                        $areaA = $partsA[0] * $partsA[1];
                        $areaB = $partsB[0] * $partsB[1];
                        
                        // Check Squareness
                        $isSquareA = ($partsA[0] === $partsA[1]);
                        $isSquareB = ($partsB[0] === $partsB[1]);
                        
                        // Logic: Rectangles First, then Squares
                        if ($isSquareA !== $isSquareB) {
                            return $isSquareA ? 1 : -1; // If A is square (true=1) and B is rect (false=0), return 1 (A goes after B)
                        }
                        
                        // If same type, sort by Area
                        return $areaA <=> $areaB;
                    });
                }
            }
            unset($items); // Good practice to unset reference after loop
        }

        // Save to DB
        foreach ($validated as $key => $value) {
            $this->settings->set($key, $value);
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}