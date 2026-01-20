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
    protected $signature = 'pictufy:sync-all {--fresh} {--skip-artworks}';

    protected $description = 'Syncs all Categories, Artists, Collections, Lists and Artworks from Pictufy API to the Database.';

    protected $pictufy;

    public function __construct(PictufyService $pictufy)
    {
        parent::__construct();
        $this->pictufy = $pictufy;
    }

    public function handle()
    {
        $start = microtime(true);

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
        $this->info('Syncing Artists (this may take a moment)...');
        
        // Fetch ALL artists (pagination loop)
        $page = 1;
        $perPage = 100;
        
        // Get first page to see total? API doesn't always give total pages.
        // We'll loop until empty.
        
        do {
            $response = $this->pictufy->getArtists(['page' => $page, 'per_page' => $perPage]);
            $items = $response['items'] ?? [];
            
            if (empty($items)) break;

            foreach ($items as $item) {
                Artist::updateOrCreate(
                    ['pictufy_id' => $item['artist_id']],
                    [
                        'username' => $item['username'] ?? null,
                        'name' => html_entity_decode($item['name']),
                        'biography' => $item['biography_text'] ?? null,
                        'profile_picture' => $item['profile_picture'] ?? null,
                        'country' => $item['country'] ?? null,
                        'artist_type' => $item['artist_type'] ?? null,
                        'artwork_count' => $item['artworks'] ?? 0,
                    ]
                );
            }
            
            $this->output->write('.'); // Visual feedback
            $page++;
        } while (count($items) >= $perPage);

        $this->newLine();
        $this->info("Artists synced.");
    }

    private function syncLists()
    {
        $this->info('Syncing Lists...');
        $response = $this->pictufy->getLists();
        $items = $response['items'] ?? [];

        foreach ($items as $item) {
            ArtworkList::updateOrCreate(
                ['pictufy_id' => $item['list_id']],
                [
                    'name' => html_entity_decode($item['name']),
                    'slug' => \Illuminate\Support\Str::slug($item['name']),
                    // 'thumb' => ... (List API response usually has thumbnails?)
                    'artwork_count' => $item['artworks'] ?? 0,
                ]
            );
        }
        $this->info("Synced " . count($items) . " Lists.");
    }

    private function syncCollections()
    {
        $this->info('Syncing Collections...');
        // We use skip_categories=1 to get a flat list of all collections
        $response = $this->pictufy->getCollections(['skip_categories' => 1]);
        $items = $response['items'] ?? [];

        foreach ($items as $item) {
            // Helper to get slug from URL if needed, or generated
            $slug = isset($item['url']) 
                ? basename(parse_url($item['url'], PHP_URL_PATH)) 
                : \Illuminate\Support\Str::slug($item['name']);

            Collection::updateOrCreate(
                ['pictufy_id' => $item['id']],
                [
                    'name' => html_entity_decode($item['name']),
                    'slug' => $slug,
                    'thumb' => $item['thumb'] ?? null,
                    'description' => $item['description'] ?? null,
                    'artwork_count' => $item['artworks'] ?? 0,
                    'category_id' => $item['category_id'] ?? null,
                ]
            );
        }
        $this->info("Synced " . count($items) . " Collections.");
    }

    private function syncArtworks()
    {
        $this->info('Syncing Artworks (Approx 40k items)...');
        
        $page = 1;
        $perPage = 100; // Safe batch size
        
        // We can check how many pages roughly if we knew total, but let's loop safely.
        // Assuming ~400 pages.
        $bar = $this->output->createProgressBar(400); // Estimation
        $bar->start();

        do {
            // Using 'recently_added' to ensure we get a consistent list if possible,
            // or just default order.
            $response = $this->pictufy->getArtworks(['page' => $page, 'per_page' => $perPage]);
            $items = $response['items'] ?? [];

            if (empty($items)) break;

            foreach ($items as $item) {
                // Map API Colors to Booleans
                $colors = $item['color'] ?? [];

                Artwork::updateOrCreate(
                    ['pictufy_id' => $item['id']],
                    [
                        'title' => html_entity_decode($item['title']['en'] ?? 'Untitled'),
                        'artist' => html_entity_decode($item['artist']),
                        'artist_id' => $item['artist_id'],
                        'category' => html_entity_decode($item['category']),
                        'category_id' => $item['category_id'],
                        'keywords' => $item['keywords']['en'] ?? '',
                        'geometry' => $item['geometry'],
                        'width' => $item['width'],
                        'height' => $item['height'],
                        'grade' => $item['grade'] ?? 0,
                        
                        // Images
                        'img_thumb' => $item['urls']['img_thumb'] ?? null,
                        'img_medium' => $item['urls']['img_medium'] ?? null,
                        'img_high' => $item['urls']['img_high'] ?? null,

                        // Colors
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

                        'artwork_published_at' => $item['artwork_published'] ?? now(),
                    ]
                );
            }

            $bar->advance();
            $page++;
            
            // Sleep slightly to be nice to the API if running on server (optional)
            // usleep(100000); 

        } while (count($items) >= $perPage);

        $bar->finish();
        $this->newLine();
        $this->info("Artworks synced.");
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
        
        $collections = Collection::all();
        $bar = $this->output->createProgressBar($collections->count());
        $bar->start();

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
                $localIds = Artwork::whereIn('pictufy_id', $artworkPictufyIds)->pluck('id')->toArray();
                
                $collection->artworks()->syncWithoutDetaching($localIds);

                $page++;
            } while (count($items) >= 100);

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }
}