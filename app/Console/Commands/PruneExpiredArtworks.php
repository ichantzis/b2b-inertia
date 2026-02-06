<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PictufyService;
use App\Models\Artwork;

class PruneExpiredArtworks extends Command
{
    protected $signature = 'pictufy:prune-expired';
    protected $description = 'Fetches expired artworks from API and removes them.';

    protected $pictufy;

    public function __construct(PictufyService $pictufy)
    {
        parent::__construct();
        $this->pictufy = $pictufy;
    }

    public function handle()
    {
        ini_set('memory_limit', '512M');
        $this->info('Fetching expired artworks list...');

        $response = $this->pictufy->getExpired();
        $items = $response['items'] ?? [];

        if (empty($items)) {
            $this->info('No expired artworks found.');
            return;
        }

        $expiredIds = array_column($items, 'artwork_id');
        $this->info("Found " . count($expiredIds) . " expired artworks. Processing...");

        $chunks = array_chunk($expiredIds, 1000);
        $deletedCount = 0;
        
        $bar = $this->output->createProgressBar(count($chunks));
        $bar->start();

        foreach ($chunks as $chunk) {
            $deletedCount += Artwork::whereIn('pictufy_id', $chunk)->delete();
            $bar->advance();
            usleep(50000);
        }

        $bar->finish();
        $this->newLine();
        $this->info("Deleted $deletedCount expired artworks.");
    }
}