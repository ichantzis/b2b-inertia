<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Default Pricing Structure
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
            'poster_framed' => [
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

        // 2. Insert Pricing Config
        Setting::updateOrCreate(
            ['key' => 'pricing_config'],
            [
                'value' => json_encode($defaultPricing), 
                'type' => 'json'
            ]
        );

        // 3. Insert Other Defaults
        Setting::updateOrCreate(
            ['key' => 'allow_public_registration'],
            ['value' => 'false', 'type' => 'boolean']
        );
        
        Setting::updateOrCreate(
            ['key' => 'require_login_for_prices'],
            ['value' => 'false', 'type' => 'boolean']
        );

        // Optional: Ensure admin email exists
        Setting::updateOrCreate(
            ['key' => 'admin_notification_email'],
            ['value' => 'chantzis84@gmail.com', 'type' => 'string']
        );
    }
}