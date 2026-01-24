<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// --- PICTUFY AUTOMATION SCHEDULE ---

// 1. Daily: Fetch new artworks (Fast sync)
// Τρέχει κάθε βράδυ στις 03:00 π.μ.
Schedule::command('pictufy:sync-all --recent --limit=100')
    ->dailyAt('03:00')
    ->withoutOverlapping();

// 2. Weekly: Update Ranks (Recommended, Best Selling, Trending)
// Τρέχει κάθε Κυριακή ξεκινώντας από τις 04:00 π.μ.
Schedule::command('pictufy:update-ranks --type=recommended --limit=5000')->weeklyOn(0, '04:00');
Schedule::command('pictufy:update-ranks --type=best_selling --limit=2000')->weeklyOn(0, '04:15');
Schedule::command('pictufy:update-ranks --type=trending --limit=2000')->weeklyOn(0, '04:30');

// 3. Weekly: Prune Expired Artworks
// Τρέχει κάθε Κυριακή στις 05:00 π.μ. (αφού τελειώσουν τα ranks)
Schedule::command('pictufy:prune-expired')->weeklyOn(0, '05:00');

// Sitemap generation (Existing)
// Schedule::command('sitemap:generate')->dailyAt('06:00');