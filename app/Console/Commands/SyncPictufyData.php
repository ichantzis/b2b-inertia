<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PictufyService;
use App\Models\Category;
use App\Models\Artist;
use App\Models\Collection;
use App\Models\ArtworkList;
use App\Models\Artwork;
use App\Models\CollectionCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SyncPictufyData extends Command
{
    /**
     * The name and signature of the console command.
     * --fresh              : Truncate tables before starting (Clean slate)
     * --skip-artworks      : Skip the heavy artwork sync
     * --recent             : Sync only recommended/recent (controlled by logic)
     * --start-page=1       : Start syncing from a specific page (useful for resuming)
     * --limit=             : Stop after syncing N items (optional)
     */
    protected $signature = 'pictufy:sync-all 
                            {--fresh} 
                            {--skip-artworks} 
                            {--recent}
                            {--start-page=1}
                            {--limit=}
                            {--update-metadata}
                            {--update-artists}
                            {--update-categories}
                            {--update-collections}
                            {--update-lists}';

    protected $description = 'Syncs all data from Pictufy API. Handles large datasets with memory optimization.';

    protected $pictufy;

    public function __construct(PictufyService $pictufy)
    {
        parent::__construct();
        $this->pictufy = $pictufy;
    }

    public function handle()
    {
        // 1. MEMORY OPTIMIZATION FOR LARGE DATASETS
        ini_set('memory_limit', '1024M');
        DB::disableQueryLog(); // Critical for 300k inserts

        $start = microtime(true);

        // --- HANDLE PARTIAL UPDATES ---
        if ($this->option('update-metadata')) {
            $this->syncMetadata();
            return;
        }
         if ($this->option('update-categories')) {
            $this->syncCategories();
            return;
        }
        if ($this->option('update-artists')) {
            $this->syncArtists();
            return;
        }
        if ($this->option('update-collections')) {
            $this->syncCollections();
            // $this->syncCollectionContents();
            return;
        }
        if ($this->option('update-lists')) {
            $this->syncLists();
            // $this->syncListContents();
            return;
        }

        // --- FRESH START ---
        if ($this->option('fresh')) {
            if ($this->confirm('This will TRUNCATE ALL artwork tables. Are you sure?')) {
                $this->truncateTables();
            }
        }

        $this->info('Starting Pictufy Sync...');

        // 2. SYNC METADATA (Always needed for relationships)
        // Skip this if we are just resuming artworks via --start-page > 1 to save time
        if ($this->option('start-page') == 1) {
            $this->syncMetadata();
        } else {
            $this->info('Skipping metadata sync because start-page > 1.');
        }

        // 3. SYNC ARTWORKS
        if (!$this->option('skip-artworks')) {
            $startPage = (int) $this->option('start-page');
            $limit = $this->option('limit') ? (int) $this->option('limit') : 300000; // Default max 300k
            
            // Mode selection
            $order = $this->option('recent') ? 'recently_added' : 'recommended';
            
            $this->info("Syncing Artworks... (Order: $order, Start Page: $startPage)");
            
            $this->syncArtworks($order, $limit, $startPage);

            // 4. SYNC RELATIONSHIPS
            // Only sync relationships if we finished properly or if requested.
            // Note: This iterates local DB, so it's safe to run even after partial syncs.
            $this->info('Updating List and Collection contents...');
            $this->syncListContents();
            $this->syncCollectionContents();
        }

        $duration = round((microtime(true) - $start) / 60, 2);
        $this->info("Sync completed in {$duration} minutes.");
    }

    private function truncateTables()
    {
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

    private function syncMetadata()
    {
        $this->syncCategories();
        $this->syncArtists(); // Fetches "Featured" artists
        $this->syncLists();
        $this->syncCollections();
    }

    private function syncCategories()
    {
        $this->info('Syncing Categories...');
        $response = $this->pictufy->getCategories();
        $items = $response['items'] ?? [];
        
        foreach ($items as $section => $categories) {
            foreach ($categories as $cat) {
                Category::updateOrCreate(
                    ['pictufy_id' => $cat['category_id']],
                    [
                        'name' => html_entity_decode($cat['category_name']),
                        'slug' => Str::slug(html_entity_decode($cat['category_name'])),
                        'parent_slug' => $section 
                    ]
                );
            }
        }
        $this->info('Categories synced.');
    }

    private function syncArtists()
    {
        $this->info('Syncing Featured Artists...');
        $response = $this->pictufy->getArtists(['order' => 'trending']); 
        $items = $response['items'] ?? [];
        
        $bar = $this->output->createProgressBar(count($items));
        $bar->start();

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
            $bar->advance();
        }
        $bar->finish();
        $this->newLine();
    }

    private function syncLists()
    {
        $this->info('Syncing Lists...');
        $response = $this->pictufy->getLists();
        $items = $response['items'] ?? [];

        foreach ($items as $item) {
            ArtworkList::updateOrCreate(
                ['pictufy_id' => (string) $item['list_id']],
                [
                    'name' => html_entity_decode($item['name']),
                    'slug' => $item['slug'] ?? Str::slug($item['name']),
                    'cover' => $item['cover'] ?? null, 
                    'description' => $item['description'] ?? null,
                    'last_change' => $item['last_change'] ?? null, 
                ]
            );
        }
        $this->info('Lists synced.');
    }

    private function syncCollections()
    {
        $this->info('Syncing Collections & Categories...');
        $response = $this->pictufy->getCollections(); 
        $groups = $response['items'] ?? [];

        foreach ($groups as $group) {
            // 1. Create/Update Collection Category
            $categoryId = $group['category_id'] ?? null;
            $categoryName = $group['category_name'] ?? 'General';

            if (!$categoryId) continue;

            $colCategory = CollectionCategory::updateOrCreate(
                ['pictufy_id' => $categoryId],
                [
                    'name' => html_entity_decode($categoryName),
                    'slug' => Str::slug(html_entity_decode($categoryName))
                ]
            );

            // 2. Process Collections inside this Category
            if (isset($group['collections']) && is_array($group['collections'])) {
                foreach ($group['collections'] as $item) {
                    if (empty($item['id'])) continue;

                    $name = $item['name'] ?? 'Untitled';
                    $slug = !empty($item['url']) 
                        ? basename(parse_url($item['url'], PHP_URL_PATH)) 
                        : Str::slug($name);

                    // Update Collection itself
                    $collection = Collection::updateOrCreate(
                        ['pictufy_id' => (string) $item['id']],
                        [
                            'name' => html_entity_decode($name),
                            'slug' => $slug ?: 'collection-' . $item['id'],
                            'thumb' => $item['thumb'] ?? null,
                            'description' => $item['description'] ?? null,
                            'artwork_count' => $item['artworks'] ?? 0,
                            // Αφαιρέσαμε τα category_id/name από εδώ
                        ]
                    );

                    // 3. Attach Collection to Category (Many-to-Many Sync)
                    // syncWithoutDetaching ensures we don't remove it from OTHER categories
                    // simply by processing this one.
                    $colCategory->collections()->syncWithoutDetaching($collection->id);
                }
            }
        }
        $this->info('Collections synced and linked to categories.');
    }

    private function syncArtworks($order, $limit, $startPage)
    {
        $page = $startPage;
        $perPage = 100;
        $totalSynced = 0;
        
        // Approx total for progress bar (291400 based on your file)
        $approxTotal = 292000; 
        $remaining = $approxTotal - (($startPage - 1) * $perPage);
        $bar = $this->output->createProgressBar(ceil($remaining / $perPage));
        $bar->start();

        do {
            $response = $this->pictufy->getArtworks([
                'page' => $page,
                'per_page' => $perPage,
                'order' => $order,
            ]);
            $items = $response['items'] ?? [];

            if (empty($items)) {
                $this->info(" No more items found at page $page.");
                break;
            }

            foreach ($items as $item) {
                // 1. Ensure Artist Exists (Harvesting)
                // Sometimes artworks belong to artists not in the main /artists list
                if (!empty($item['artist_id'])) {
                    // Using firstOrCreate to avoid overhead of updating every time
                    Artist::firstOrCreate(
                        ['pictufy_id' => $item['artist_id']],
                        [
                            'name' => html_entity_decode($item['artist']),
                            'slug' => Str::slug($item['artist']), // Fallback slug
                            'artwork_count' => 1 // Placeholder
                        ]
                    );
                }

                // 2. Clean Data
                $keywords = $item['keywords']['en'] ?? '';
                if (!empty($keywords) && str_starts_with($keywords, $item['id'] . ',')) {
                    $keywords = substr($keywords, strlen($item['id']) + 1);
                }

                $publishedAt = $item['artwork_published'] ?? null;
                if (!$publishedAt || str_starts_with($publishedAt, '1970')) {
                    $publishedAt = null;
                }

                $colors = $item['color'] ?? [];

                // 3. Save Artwork
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
                        'artwork_published_at' => $publishedAt,
                    ]
                );
            }

            $totalSynced += count($items);
            $bar->advance();
            
            // Log progress every 10 pages so user knows where to resume if it crashes
            if ($page % 10 === 0) {
                // Optional: $this->info("Reached page $page...");
            }

            $page++;
            
            // Memory Cleanup
            gc_collect_cycles();

            if ($totalSynced >= $limit) break;

        } while (count($items) >= $perPage);

        $bar->finish();
        $this->newLine();
        $this->info("Synced $totalSynced artworks.");
    }

    private function syncListContents()
    {
        $this->info('Mapping Artworks to Lists...');
        $lists = ArtworkList::all();
        $bar = $this->output->createProgressBar($lists->count());
        $bar->start();

        foreach ($lists as $list) {
            $page = 1;
            do {
                $response = $this->pictufy->getArtworks([
                    'list_id' => $list->pictufy_id,
                    'page' => $page,
                    'per_page' => 100
                ]);
                $items = $response['items'] ?? [];
                if (empty($items)) break;

                $artworkPictufyIds = collect($items)->pluck('id')->toArray();
                $localIds = Artwork::whereIn('pictufy_id', $artworkPictufyIds)->pluck('id')->toArray();

                $list->artworks()->syncWithoutDetaching($localIds);
                $page++;
            } while (count($items) >= 100);
            
            $bar->advance();
            gc_collect_cycles(); 
        }
        $bar->finish();
        $this->newLine();
    }

    private function syncCollectionContents()
    {
        $this->info('Mapping Artworks to Collections...');
        $count = Collection::count();
        $bar = $this->output->createProgressBar($count);
        $bar->start();

        Collection::chunk(20, function ($collections) use ($bar) {
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
                    if ($page > 50) break; 
                } while (count($items) >= 100);
                
                $bar->advance();
            }
            gc_collect_cycles();
        });
        $bar->finish();
        $this->newLine();
    }
}