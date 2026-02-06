<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PictufyService;
use Illuminate\Support\Facades\DB;

class UpdatePictufyRanks extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'pictufy:update-ranks {--type=recommended} {--limit=2000}';

    /**
     * The console command description.
     */
    protected $description = 'Updates ranking columns (recommended, best_selling, trending) based on API order.';

    protected $pictufy;

    public function __construct(PictufyService $pictufy)
    {
        parent::__construct();
        $this->pictufy = $pictufy;
    }

    public function handle()
    {
        ini_set('memory_limit', '1024M');
        // Settings
        $type = $this->option('type');
        $limit = (int) $this->option('limit');
        
        // Map API order types to Database columns
        $columnMap = [
            'recommended' => 'recommended_rank',
            'best_selling' => 'best_seller_rank',
            'trending' => 'trending_rank',
        ];

        if (!array_key_exists($type, $columnMap)) {
            $this->error("Invalid type. Use: recommended, best_selling, or trending.");
            return;
        }

        $column = $columnMap[$type];
        $this->info("Updating [$column] based on API order [$type] (Grade >= 1)...");

        // 1. Reset ranks for this type (Optional: clears old ranks)
        // DB::table('artworks')->update([$column => null]); 

        $page = 1;
        $perPage = 100;
        $rankCounter = 1;

        $bar = $this->output->createProgressBar($limit);
        $bar->start();

        do {
            // Fetch IDs from API in the specific order
            $response = $this->pictufy->getArtworks([
                'page' => $page,
                'per_page' => $perPage,
                'order' => $type,
                'grade' => 1, // Only fetch rank for valid artworks
            ]);

            $items = $response['items'] ?? [];
            if (empty($items)) break;

            foreach ($items as $item) {
                // Update the rank column directly in DB
                DB::table('artworks')
                    ->where('pictufy_id', $item['id'])
                    ->update([$column => $rankCounter]);

                $rankCounter++;
                $bar->advance();

                if ($rankCounter > $limit) break 2;
            }

            $page++;
        } while (count($items) >= $perPage);

        $bar->finish();
        $this->newLine();
        $this->info("Updated top $limit artworks for $type.");
    }
}