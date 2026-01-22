<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PictufyService;
use App\Models\Category;
use App\Models\Artist;
use App\Models\Collection;
use App\Models\ArtworkList;
use App\Models\Artwork;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SyncPictufyData extends Command
{
    /**
     * The name and signature of the console command.
     * --fresh : Truncate tables before starting (Clean slate)
     * --skip-artworks : Skip the heavy artwork sync (useful for debugging metadata)
     */

    // Add {--collections-only} to the signature
    protected $signature = 'pictufy:sync-all {--fresh} {--skip-artworks} {--collections-only} {--lists-only}';

    protected $description = 'Syncs all Categories, Artists, Collections, Lists and Artworks from Pictufy API to the Database.';

    protected $pictufy;

    public function __construct(PictufyService $pictufy)
    {
        parent::__construct();
        $this->pictufy = $pictufy;
    }

    public function handle()
    {
        ini_set('memory_limit', '1024M');

        $start = microtime(true);

        // --- CHECK FOR FLAG ---
        if ($this->option('collections-only')) {
            $this->info('Running PARTIAL sync: Collections Only.');
            $this->syncCollections(); 
            $this->info('Collections sync completed.');
            return;
        }

        if ($this->option('lists-only')) {
            $this->info('Running PARTIAL sync: Lists Only.');
            $this->syncLists(); 
            $this->info('Lists sync completed.');
            return;
        }

        // Optional: Clean slate
        if ($this->option('fresh')) {
            if ($this->confirm('This will truncate all artwork tables. Are you sure?')) {
                $this->info('Truncating tables...');
                DB::statement('SET FOREIGN_KEY_CHECKS=0;');
                Artwork::truncate();
                Artist::truncate();
                Category::truncate();
                Collection::truncate();
                ArtworkList::truncate();
                DB::table('artwork_collection')->truncate();
                DB::table('artwork_artwork_list')->truncate();
                DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            }
        }

        $this->info('Starting Pictufy Sync...');

        // 1. Sync Base Metadata
        $this->syncCategories();
        $this->syncArtists();
        $this->syncLists();
        $this->syncCollections();

        // 2. Sync Artworks (The heavy part)
        if (!$this->option('skip-artworks')) {
            $this->syncArtworks();

            // 3. Sync Relationships (Connecting Artworks to Lists/Collections)
            // This is necessary because the "All Artworks" endpoint doesn't tell us 
            // which Collection/List an artwork belongs to.
            $this->syncListContents();
            $this->syncCollectionContents();
        }

        $duration = round((microtime(true) - $start) / 60, 2);
        $this->info("Sync completed in {$duration} minutes.");
    }

    private function syncCategories()
    {
        $this->info('Syncing Categories...');
        $response = $this->pictufy->getCategories();

        // API returns categorized array (e.g. ['photography' => [...], 'illustration' => [...]])
        // We flatten it or iterate sections.
        $items = $response['items'] ?? [];
        $count = 0;

        foreach ($items as $section => $categories) {
            foreach ($categories as $cat) {
                Category::updateOrCreate(
                    ['pictufy_id' => $cat['category_id']],
                    [
                        'name' => html_entity_decode($cat['category_name']),
                        'slug' => \Illuminate\Support\Str::slug(html_entity_decode($cat['category_name'])),
                        'parent_slug' => $section // e.g., 'photography'
                    ]
                );
                $count++;
            }
        }
        $this->info("Synced $count Categories.");
    }

    private function syncArtists()
    {
        $this->info('Syncing Artists...');

        // 1. Fetch ALL artists in one request (since API doesn't paginate this)
        $response = $this->pictufy->getArtists();
        $items = $response['items'] ?? [];

        if (empty($items)) {
            $this->info('No artists found.');
            return;
        }

        $totalItems = count($items);
        $this->info("Found $totalItems artists. Processing...");

        $syncedCount = 0;

        // 2. Initialize Progress Bar
        $bar = $this->output->createProgressBar($totalItems);
        $bar->start();

        foreach ($items as $item) {
            // Restriction: Only sync artists with >= 10 artworks
            $count = $item['artworks'] ?? 0;

            if ($count < 10) {
                $bar->advance(); // Still advance bar to show progress
                continue;
            }

            Artist::updateOrCreate(
                ['pictufy_id' => $item['artist_id']],
                [
                    'username' => $item['username'] ?? null,
                    'name' => html_entity_decode($item['name']),
                    'biography' => $item['biography_text'] ?? null,
                    'profile_picture' => $item['profile_picture'] ?? null,
                    'country' => $item['country'] ?? null,
                    'artist_type' => $item['artist_type'] ?? null,
                    'artwork_count' => $count,
                ]
            );

            $syncedCount++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Synced $syncedCount Artists (filtered by > 10 artworks).");
    }

    private function syncLists()
    {
        $this->info('Syncing Lists...');
        $response = $this->pictufy->getLists();
        $items = $response['items'] ?? [];

        foreach ($items as $item) {
            \App\Models\ArtworkList::updateOrCreate(
                ['pictufy_id' => (string) $item['list_id']], // API Key: list_id
                [
                    'name' => html_entity_decode($item['name']),
                    'slug' => $item['slug'] ?? \Illuminate\Support\Str::slug($item['name']),
                    
                    // Map API 'cover' to DB 'cover'
                    'cover' => $item['cover'] ?? null, 
                    
                    'description' => $item['description'] ?? null,
                    
                    // Map API 'last_change' to DB 'last_change'
                    'last_change' => $item['last_change'] ?? null, 
                ]
            );
        }
        $this->info('Lists synced.');
    }

    private function syncCollections()
    {
        $this->info('Syncing Collections (Structured)...');
        
        $response = $this->pictufy->getCollections(); 
        $categories = $response['items'] ?? [];

        $totalCollections = 0;

        foreach ($categories as $cat) {
            $categoryId = $cat['category_id'] ?? null;
            $categoryName = $cat['category_name'] ?? 'General';
            
            // Debug output to confirm we are getting names
            // $this->line("Processing Category: $categoryName ($categoryId)"); 

            if (isset($cat['collections']) && is_array($cat['collections'])) {
                foreach ($cat['collections'] as $item) {
                    if (empty($item['id'])) continue;

                    $name = $item['name'] ?? 'Untitled Collection';
                    
                    if (!empty($item['url'])) {
                        $slug = basename(parse_url($item['url'], PHP_URL_PATH));
                    } else {
                        $slug = \Illuminate\Support\Str::slug($name);
                    }

                    // Force update by finding the model first
                    $collection = Collection::where('pictufy_id', (string) $item['id'])->first();

                    if ($collection) {
                        // Update existing
                        $collection->update([
                            'name' => html_entity_decode($name),
                            'category_id' => $categoryId,
                            'category_name' => html_entity_decode($categoryName), // Saving the name
                            'slug' => $slug ?: 'collection-' . $item['id'],
                            // Update other fields if you wish, but name/cat is priority
                        ]);
                    } else {
                        // Create new
                        Collection::create([
                            'pictufy_id' => (string) $item['id'],
                            'name' => html_entity_decode($name),
                            'slug' => $slug ?: 'collection-' . $item['id'],
                            'thumb' => $item['thumb'] ?? null,
                            'description' => $item['description'] ?? null,
                            'artwork_count' => $item['artworks'] ?? 0,
                            'category_id' => $categoryId,
                            'category_name' => html_entity_decode($categoryName),
                        ]);
                    }
                    $totalCollections++;
                }
            }
        }
        
        $this->info("Synced $totalCollections collections.");
    }

    private function syncArtworks()
    {
        $limit = 1000;
        $this->info("Syncing first $limit Artworks...");

        $page = 1;
        $perPage = 100;
        $totalSynced = 0;

        $bar = $this->output->createProgressBar(ceil($limit / $perPage));
        $bar->start();

        do {
            $response = $this->pictufy->getArtworks([
                'page' => $page,
                'per_page' => $perPage,
                'order' => 'best_selling',
            ]);
            $items = $response['items'] ?? [];

            if (empty($items)) break;

            foreach ($items as $item) {
                // --- FIX 1: Clean Keywords (Remove ID prefix) ---
                $keywords = $item['keywords']['en'] ?? '';
                if (!empty($keywords) && str_starts_with($keywords, $item['id'] . ',')) {
                    $keywords = substr($keywords, strlen($item['id']) + 1);
                }

                // --- FIX 2: Handle Invalid Dates (1970 Epoch) ---
                $publishedAt = $item['artwork_published'] ?? null;
                // If date is missing or is the Unix Epoch start (1970...), set to NULL
                if (!$publishedAt || str_starts_with($publishedAt, '1970')) {
                    $publishedAt = null;
                }

                $colors = $item['color'] ?? [];

                Artwork::updateOrCreate(
                    ['pictufy_id' => $item['id']],
                    [
                        'title' => html_entity_decode($item['title']['en'] ?? 'Untitled'),
                        'artist' => html_entity_decode($item['artist']),
                        'artist_id' => $item['artist_id'],
                        'category' => html_entity_decode($item['category']),
                        'category_id' => $item['category_id'],
                        'keywords' => $keywords,
                        'geometry' => $item['geometry'],
                        'width' => $item['width'],
                        'height' => $item['height'],
                        'grade' => $item['grade'] ?? 0,
                        'img_thumb' => $item['urls']['img_thumb'] ?? null,
                        'img_medium' => $item['urls']['img_medium'] ?? null,
                        'img_high' => $item['urls']['img_high'] ?? null,
                        'has_red' => $colors['red'] ?? false,
                        'has_orange' => $colors['orange'] ?? false,
                        'has_yellow' => $colors['yellow'] ?? false,
                        'has_green' => $colors['green'] ?? false,
                        'has_turquoise' => $colors['turquoise'] ?? false,
                        'has_blue' => $colors['blue'] ?? false,
                        'has_lilac' => $colors['lilac'] ?? false,
                        'has_pink' => $colors['pink'] ?? false,
                        'is_highkey' => $colors['highkey'] ?? false,
                        'is_lowkey' => $colors['lowkey'] ?? false,
                        'artwork_published_at' => $publishedAt, // Use cleaned date
                    ]
                );
            }

            $totalSynced += count($items);
            $bar->advance();
            $page++;

            if ($totalSynced >= $limit) break;
        } while (count($items) >= $perPage);

        $bar->finish();
        $this->newLine();
        $this->info("Synced $totalSynced artworks.");
    }

    private function syncListContents()
    {
        $this->info('Mapping Artworks to Lists (Populating Pivot)...');

        $lists = ArtworkList::all();
        $bar = $this->output->createProgressBar($lists->count());
        $bar->start();

        foreach ($lists as $list) {
            // Fetch artworks SPECIFIC to this list
            // Note: We might need to pagination loop here too if a list has > 100 items!
            $page = 1;
            do {
                $response = $this->pictufy->getArtworks([
                    'list_id' => $list->pictufy_id,
                    'page' => $page,
                    'per_page' => 100
                ]);
                $items = $response['items'] ?? [];

                if (empty($items)) break;

                // Collect local IDs
                $artworkPictufyIds = collect($items)->pluck('id')->toArray();

                // Find local IDs for these Pictufy IDs
                $localIds = Artwork::whereIn('pictufy_id', $artworkPictufyIds)->pluck('id')->toArray();

                // Attach without detaching previous (since we page)
                // OR better: Sync if it's the first page? 
                // Simplest: just attach. 'syncWithoutDetaching'
                $list->artworks()->syncWithoutDetaching($localIds);

                $page++;
            } while (count($items) >= 100);

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }

    private function syncCollectionContents()
    {
        $this->info('Mapping Artworks to Collections (Populating Pivot)...');

        // Use chunking to avoid loading all 500 collections into RAM at once
        $count = Collection::count();
        $bar = $this->output->createProgressBar($count);
        $bar->start();

        // Process in chunks of 50
        Collection::chunk(50, function ($collections) use ($bar) {
            foreach ($collections as $collection) {
                $page = 1;
                do {
                    $response = $this->pictufy->getArtworks([
                        'collection_id' => $collection->pictufy_id,
                        'page' => $page,
                        'per_page' => 100
                    ]);
                    $items = $response['items'] ?? [];

                    if (empty($items)) break;

                    $artworkPictufyIds = collect($items)->pluck('id')->toArray();

                    // Optimization: Only select ID to save memory
                    $localIds = Artwork::whereIn('pictufy_id', $artworkPictufyIds)->pluck('id')->toArray();

                    $collection->artworks()->syncWithoutDetaching($localIds);

                    $page++;

                    // Break infinite loop safeguard
                    if ($page > 50) break;
                } while (count($items) >= 100);

                $bar->advance();
            }

            // --- Free up memory after every chunk ---
            gc_collect_cycles();
        });

        $bar->finish();
        $this->newLine();
    }
}
