<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        // helper function to calculate oil price (10% increase, ceiled)
        $addOilPrice = function ($items) {
            return array_map(function ($item) {
                $item['oil_price'] = (int) ceil($item['price'] * 1.10);
                return $item;
            }, $items);
        };

        // 1. Defined Pricing Structure
        $canvasFramed = [
            ['size' => '40x60', 'price' => 80],
            ['size' => '50x70', 'price' => 90],
            ['size' => '60x80', 'price' => 120],
            ['size' => '70x100', 'price' => 160],
            ['size' => '80x120', 'price' => 190],
            ['size' => '100x140', 'price' => 220],
            ['size' => '100x150', 'price' => 250],
            ['size' => '120x160', 'price' => 320],
            ['size' => '120x180', 'price' => 370],
            ['size' => '140x200', 'price' => 660],
            ['size' => '140x240', 'price' => 740],
            ['size' => '50x50', 'price' => 75],
            ['size' => '80x80', 'price' => 160],
            ['size' => '100x100', 'price' => 200],
            ['size' => '120x120', 'price' => 240],
            ['size' => '140x140', 'price' => 330]
        ];

        $canvasNoFrame = [
            ['size' => '40x60', 'price' => 60],
            ['size' => '50x70', 'price' => 70],
            ['size' => '60x80', 'price' => 90],
            ['size' => '70x100', 'price' => 115],
            ['size' => '80x120', 'price' => 132],
            ['size' => '100x140', 'price' => 150],
            ['size' => '100x150', 'price' => 180],
            ['size' => '120x160', 'price' => 240],
            ['size' => '120x180', 'price' => 260],
            ['size' => '140x200', 'price' => 350],
            ['size' => '140x240', 'price' => 440],
            ['size' => '45x45', 'price' => 50],
            ['size' => '75x75', 'price' => 80],
            ['size' => '100x100', 'price' => 120],
            ['size' => '120x120', 'price' => 160],
            ['size' => '135x135', 'price' => 220]
        ];

        $posterFramed = [
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
            ['size' => '120x120', 'price' => 396]
        ];

        $defaultPricing = [
            'canvas_framed' => $addOilPrice($canvasFramed),
            'canvas_noframe' => $addOilPrice($canvasNoFrame),
            'poster_framed' => $posterFramed, // No oil price for posters
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

        Setting::updateOrCreate(
            ['key' => 'admin_notification_email'],
            ['value' => 'chantzis84@gmail.com', 'type' => 'string']
        );
    }
}