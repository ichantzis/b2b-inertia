<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingsService
{
    /**
     * Get a setting value by key.
     */
    public function get($key, $default = null)
    {
        // Cache settings for 24 hours to improve performance
        return Cache::remember("setting_{$key}", 60 * 24, function () use ($key, $default) {
            $setting = Setting::where('key', $key)->first();
            
            if (!$setting) {
                return $default;
            }

            // Cast value based on type
            return match ($setting->type) {
                'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
                'json' => json_decode($setting->value, true),
                'integer' => (int) $setting->value,
                default => $setting->value,
            };
        });
    }

    /**
     * Set/Update a setting value.
     */
    public function set($key, $value, $type = 'string')
    {
        // Handle array/json storage
        $storedValue = $value;
        if (is_array($value) || is_object($value)) {
            $storedValue = json_encode($value);
            $type = 'json';
        } elseif (is_bool($value)) {
            $storedValue = $value ? 'true' : 'false';
            $type = 'boolean';
        }

        Setting::updateOrCreate(
            ['key' => $key],
            ['value' => $storedValue, 'type' => $type]
        );

        // Clear cache so the next 'get' call fetches fresh data
        Cache::forget("setting_{$key}");
    }
}