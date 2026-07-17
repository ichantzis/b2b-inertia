<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use App\Models\Setting;
use App\Models\PricingTier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    protected $settings;

    public function __construct(SettingsService $settings)
    {
        $this->settings = $settings;
    }

    // public function index()
    // {
    //     // Default pricing structure for fallback
    //     $defaultPricing = [
    //         'canvas_framed' => [
    //             ['size' => '40x60', 'price' => 144],
    //             // ... (abbreviated for brevity, same as before)
    //         ],
    //         'canvas_noframe' => [],
    //         'poster_framed' => []
    //     ];

    //     $settings = Setting::pluck('value', 'key')->toArray();

    //     return Inertia::render('dashboard/Settings', [
    //         'settings' => [
    //             'admin_notification_email' => $this->settings->get('admin_notification_email', config('mail.from.address')),
    //             'require_login_for_prices' => (bool) $this->settings->get('require_login_for_prices', false),
    //             'allow_public_registration' => (bool) $this->settings->get('allow_public_registration', false),
    //             'pricing_config' => $this->settings->get('pricing_config', $defaultPricing),
    //             // ΝΕΑ ΠΕΔΙΑ: Hero Banner Configuration
    //             'hero_title' => $this->settings->get('hero_title', ''),
    //             'hero_subtitle' => $this->settings->get('hero_subtitle', ''),
    //             'hero_button1_text' => $this->settings->get('hero_button1_text', ''),
    //             'hero_button1_link' => $this->settings->get('hero_button1_link', ''),
    //             'hero_button2_text' => $this->settings->get('hero_button2_text', ''),
    //             'hero_button2_link' => $this->settings->get('hero_button2_link', ''),
    //             'hero_image' => $this->settings->get('hero_image', null),

    //             // ΝΕΑ ΠΕΔΙΑ: Featured Layout (3 Columns)
    //             'col1_title' => $this->settings->get('col1_title', ''),
    //             'col1_link' => $this->settings->get('col1_link', ''),
    //             'col1_image' => $this->settings->get('col1_image', null),

    //             'col2_title' => $this->settings->get('col2_title', ''),
    //             'col2_link' => $this->settings->get('col2_link', ''),
    //             'col2_image' => $this->settings->get('col2_image', null),

    //             'col3_title' => $this->settings->get('col3_title', ''),
    //             'col3_link' => $this->settings->get('col3_link', ''),
    //             'col3_image' => $this->settings->get('col3_image', null),

    //             // Editor's pick Layout
    //             'editor_title'       => $this->settings->get('editor_title', 'THE EDITOR\'S PICK - MAY'),
    //             'editor_description' => $this->settings->get('editor_description', 'Discover the world\'s top posters...'),
    //             'editor_button_text' => $this->settings->get('editor_button_text', 'Shop Collection'),
    //             'editor_button_link' => $this->settings->get('editor_button_link', '#'),
    //             'editor_image'       => $this->settings->get('editor_image', null),
    //         ]
    //     ]);
    // }

    public function general()
    {
        return Inertia::render('dashboard/settings/General', [
            'settings' => [
                'admin_notification_email' => $this->settings->get('admin_notification_email', config('mail.from.address')),
                'require_login_for_prices' => (bool) $this->settings->get('require_login_for_prices', false),
                'allow_public_registration' => (bool) $this->settings->get('allow_public_registration', false),
            ]
        ]);
    }

    public function homepage()
    {
        return Inertia::render('dashboard/settings/Homepage', [
            'settings' => [
                // ΝΕΑ ΠΕΔΙΑ: Hero Banner Configuration
                'hero_title' => $this->settings->get('hero_title', ''),
                'hero_subtitle' => $this->settings->get('hero_subtitle', ''),
                'hero_button1_text' => $this->settings->get('hero_button1_text', ''),
                'hero_button1_link' => $this->settings->get('hero_button1_link', ''),
                'hero_button2_text' => $this->settings->get('hero_button2_text', ''),
                'hero_button2_link' => $this->settings->get('hero_button2_link', ''),
                'hero_image' => $this->settings->get('hero_image', null),

                // ΝΕΑ ΠΕΔΙΑ: Featured Layout (3 Columns)
                'col1_title' => $this->settings->get('col1_title', ''),
                'col1_link' => $this->settings->get('col1_link', ''),
                'col1_image' => $this->settings->get('col1_image', null),

                'col2_title' => $this->settings->get('col2_title', ''),
                'col2_link' => $this->settings->get('col2_link', ''),
                'col2_image' => $this->settings->get('col2_image', null),

                'col3_title' => $this->settings->get('col3_title', ''),
                'col3_link' => $this->settings->get('col3_link', ''),
                'col3_image' => $this->settings->get('col3_image', null),

                // Editor's pick Layout
                'editor_title'       => $this->settings->get('editor_title', 'THE EDITOR\'S PICK - MAY'),
                'editor_description' => $this->settings->get('editor_description', 'Discover the world\'s top posters...'),
                'editor_button_text' => $this->settings->get('editor_button_text', 'Shop Collection'),
                'editor_button_link' => $this->settings->get('editor_button_link', '#'),
                'editor_image'       => $this->settings->get('editor_image', null),
            ]
        ]);
    }

    public function pricing()
    {
        $defaultPricing = [
            'canvas_framed' => [['size' => '40x60', 'price' => 144]],
            'canvas_noframe' => [],
            'poster_framed' => []
        ];

        $tiers = PricingTier::orderBy('discount_percentage', 'asc')->get();

        return Inertia::render('dashboard/settings/Pricing', [
            'settings' => [
                'pricing_config' => $this->settings->get('pricing_config', $defaultPricing),
            ],
            'pricingTiers' => $tiers,
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
            'pricing_config.canvas_framed.*.oil_price' => 'nullable|numeric|min:0',
            'pricing_config.canvas_noframe.*.size' => 'required_with:pricing_config|string',
            'pricing_config.canvas_noframe.*.price' => 'required_with:pricing_config|numeric|min:0',
            'pricing_config.canvas_noframe.*.oil_price' => 'nullable|numeric|min:0',
            'pricing_config.poster_framed.*.size' => 'required_with:pricing_config|string',
            'pricing_config.poster_framed.*.price' => 'required_with:pricing_config|numeric|min:0',
            'hero_title' => 'nullable|string|max:255',
            'hero_subtitle' => 'nullable|string|max:255',
            'hero_button1_text' => 'nullable|string|max:50',
            'hero_button1_link' => 'nullable|string|max:255',
            'hero_button2_text' => 'nullable|string|max:50',
            'hero_button2_link' => 'nullable|string|max:255',
            'hero_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            // Rules for 3 columns
            'col1_title' => 'nullable|string|max:255',
            'col1_link'  => 'nullable|string|max:255',
            'col1_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',

            'col2_title' => 'nullable|string|max:255',
            'col2_link'  => 'nullable|string|max:255',
            'col2_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',

            'col3_title' => 'nullable|string|max:255',
            'col3_link'  => 'nullable|string|max:255',
            'col3_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            // Editor's pick section
            'editor_title'       => 'nullable|string|max:255',
            'editor_description' => 'nullable|string',
            'editor_button_text' => 'nullable|string|max:50',
            'editor_button_link' => 'nullable|string|max:255',
            'editor_image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
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

        if ($request->hasFile('hero_image')) {
            $path = $request->file('hero_image')->store('hero', 'public');
            // Αποθήκευση του path μέσω του SettingsService σου
            $this->settings->set('hero_image', '/storage/' . $path);

            // Αφαίρεση από τον πίνακα $validated για να περάσουν τα υπόλοιπα κανονικά
            unset($validated['hero_image']);
        }

        $columns = ['col1_image', 'col2_image', 'col3_image'];
        foreach ($columns as $col_image) {
            if ($request->hasFile($col_image)) {
                $path = $request->file($col_image)->store('featured_columns', 'public');
                $this->settings->set($col_image, '/storage/' . $path);
                unset($validated[$col_image]); // Αφαίρεση για να μην ξανα-αποθηκευτεί στο παρακάτω loop
            }
        }

        if ($request->hasFile('editor_image')) {
            $path = $request->file('editor_image')->store('editor_pick', 'public');
            $this->settings->set('editor_image', '/storage/' . $path);
            unset($validated['editor_image']);
        }

        // Save validated fields to the database/settings service
        foreach ($validated as $key => $value) {
            $this->settings->set($key, $value);
        }

        // Determine success message based on what was updated
        $message = 'Settings updated successfully.';
        if ($request->has('admin_notification_email')) $message = 'Admin email saved.';
        if ($request->has('pricing_config')) $message = 'Price lists saved.';
        if ($request->has('require_login_for_prices') || $request->has('allow_public_registration')) {
            $message = 'Access settings updated.';
        }

        return back();
    }

    /**
     * Execute artisan commands manually from dashboard.
     */
    public function runCommand(Request $request)
    {
        $request->validate([
            'command_key' => 'required|string'
        ]);

        $key = $request->input('command_key');
        $message = 'Command executed successfully.';

        set_time_limit(120);

        try {
            switch ($key) {
                case 'sync_recent':
                    Artisan::call('pictufy:sync-all', ['--recent' => true, '--limit' => 200]);
                    $message = 'Recent artworks synced successfully.';
                    break;

                case 'update_ranks':
                    Artisan::call('pictufy:update-ranks', ['--type' => 'recommended', '--limit' => 2000]);
                    Artisan::call('pictufy:update-ranks', ['--type' => 'best_selling', '--limit' => 1000]);
                    Artisan::call('pictufy:update-ranks', ['--type' => 'trending', '--limit' => 1000]);
                    $message = 'Ranks updated (Recommended, Best Selling, Trending).';
                    break;

                case 'prune_expired':
                    Artisan::call('pictufy:prune-expired');
                    $message = 'Expired artworks pruned successfully.';
                    break;

                default:
                    return back()->with('error', 'Unknown command.');
            }
        } catch (\Exception $e) {
            return back()->with('error', 'Error executing command: ' . $e->getMessage());
        }

        return back()->with('success', $message);
    }
}
