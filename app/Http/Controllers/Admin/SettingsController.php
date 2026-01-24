<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
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
        // Default pricing structure for fallback
        $defaultPricing = [
            'canvas_framed' => [
                ['size' => '40x60', 'price' => 144],
                // ... (abbreviated for brevity, same as before)
            ],
            'canvas_noframe' => [],
            'poster_framed' => []
        ];

        return Inertia::render('dashboard/Settings', [
            'settings' => [
                'admin_notification_email' => $this->settings->get('admin_notification_email', config('mail.from.address')),
                'require_login_for_prices' => (bool) $this->settings->get('require_login_for_prices', false),
                'allow_public_registration' => (bool) $this->settings->get('allow_public_registration', false),
                'pricing_config' => $this->settings->get('pricing_config', $defaultPricing),
            ]
        ]);
    }

    public function update(Request $request)
    {
        // We use 'sometimes' to allow partial updates (e.g. just email, or just toggles)
        $validated = $request->validate([
            'admin_notification_email' => 'sometimes|required|email',
            'require_login_for_prices' => 'sometimes|boolean',
            'allow_public_registration' => 'sometimes|boolean',
            'pricing_config' => 'sometimes|array',
            'pricing_config.canvas_framed.*.size' => 'required_with:pricing_config|string',
            'pricing_config.canvas_framed.*.price' => 'required_with:pricing_config|numeric|min:0',
            'pricing_config.canvas_noframe.*.size' => 'required_with:pricing_config|string',
            'pricing_config.canvas_noframe.*.price' => 'required_with:pricing_config|numeric|min:0',
            'pricing_config.poster_framed.*.size' => 'required_with:pricing_config|string',
            'pricing_config.poster_framed.*.price' => 'required_with:pricing_config|numeric|min:0',
        ]);

        // SORTING LOGIC: Only run if pricing_config is being updated
        if (isset($validated['pricing_config'])) {
            foreach ($validated['pricing_config'] as $key => &$items) {
                if (is_array($items)) {
                    usort($items, function ($a, $b) {
                        // 1. Normalize Size String
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
                            return $isSquareA ? 1 : -1;
                        }
                        
                        // If same type, sort by Area
                        return $areaA <=> $areaB;
                    });
                }
            }
            unset($items);
        }

        // Save validated fields to the database/settings service
        foreach ($validated as $key => $value) {
            $this->settings->set($key, $value);
        }

        // Determine success message based on what was updated
        $message = 'Settings updated successfully.';
        if ($request->has('admin_notification_email')) $message = 'Admin email saved.';
        if ($request->has('pricing_config')) $message = 'Price lists saved and sorted.';
        if ($request->has('require_login_for_prices') || $request->has('allow_public_registration')) {
            $message = 'Access settings updated.';
        }

        return back()->with('success', $message);
    }

}