<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Services\PictufyService;
use Illuminate\Support\Str;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     */
    protected $description = 'Generate the sitemap.xml file crawling all artworks via API';

    protected $pictufy;

    /**
     * Dependency Injection του Service στον Constructor
     */
    public function __construct(PictufyService $pictufy)
    {
        parent::__construct();
        $this->pictufy = $pictufy;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // 1. Initialize Sitemap
        $sitemap = Sitemap::create();
        
        $this->info('Starting sitemap generation...');

        // 2. Add Static Pages
        $sitemap->add(Url::create('/')->setPriority(1.0)->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY));
        $sitemap->add(Url::create(route('collections.index'))->setPriority(0.9));
        $sitemap->add(Url::create(route('lists'))->setPriority(0.9));
        $sitemap->add(Url::create(route('artists.overview'))->setPriority(0.9));
        $sitemap->add(Url::create(route('about'))->setPriority(0.7));
        $sitemap->add(Url::create(route('contact'))->setPriority(0.7));
        // Πρόσθεσε εδώ άλλες στατικές σελίδες (π.χ. About, Contact)

        // 3. Artworks Loop (Pagination)
        $page = 1;
        $perPage = 100; // We take 100 at a time so that the memory does not fill up.
        $hasMore = true;
        $totalAdded = 0;

        $this->info("Fetching artworks from API...");

        do {
            try {                
                $response = $this->pictufy->getArtworks([
                    'page' => $page,
                    'per_page' => $perPage,
                ]);

                $items = $response['items'] ?? [];

                // If the page is empty, we stop.
                if (empty($items)) {
                    $hasMore = false;
                    break;
                }

                foreach ($items as $artwork) {
                    // Create Slug from Title
                    $slug = Str::slug($artwork['title']['en'] ?? 'artwork');
                    
                    // Create URL: /artwork/{id}/{slug}
                    $url = route('artwork.details', ['id' => $artwork['id'], 'slug' => $slug]);

                    $sitemap->add(
                        Url::create($url)
                            ->setLastModificationDate(now()) // Or $artwork['updated_at'] if it exists
                            ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                            ->setPriority(0.8)
                    );
                    
                    $totalAdded++;
                }

                $this->info("Processed page $page (" . count($items) . " items). Total: $totalAdded");

                // Check if we have reached the end (if the items are less than the limit, end)
                if (count($items) < $perPage) {
                    $hasMore = false;
                } else {
                    $page++;
                    // Optional: Small delay to avoid "choking" the API
                    // usleep(200000); // 0.2 seconds
                }

            } catch (\Exception $e) {
                $this->error("Error on page $page: " . $e->getMessage());
                // We decide whether to continue or stop.
                // $hasMore = false; 
                break; 
            }

        } while ($hasMore);

        // 4. Write to the file (public/sitemap.xml)
        $path = public_path('sitemap.xml');
        $sitemap->writeToFile($path);

        $this->info("Sitemap generated successfully at $path with $totalAdded artworks.");
    }
}