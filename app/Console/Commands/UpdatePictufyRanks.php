<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PictufyService;
use App\Models\Artwork;
use Illuminate\Support\Facades\DB;

class UpdatePictufyRanks extends Command
{
    /**
     * Εντολή για ενημέρωση μόνο των κατατάξεων.
     * --type= : recommended, best_selling, trending
     * --limit= : Πόσα έργα να ενημερώσουμε (π.χ. τα top 2000)
     */
    protected $signature = 'pictufy:update-ranks {--type=recommended} {--limit=2000}';
    protected $description = 'Updates ranking columns (recommended, best_selling, trending) based on API order.';

    protected $pictufy;

    public function __construct(PictufyService $pictufy)
    {
        parent::__construct();
        $this->pictufy = $pictufy;
    }

    public function handle()
    {
        $type = $this->option('type');
        $limit = (int) $this->option('limit');
        
        // Αντιστοίχιση τύπου με στήλη βάσης
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
        $this->info("Updating [$column] based on API order [$type]...");

        // 1. Reset ranks (Optional: Set all to NULL first if you want strict ordering)
        // DB::table('artworks')->update([$column => null]); 

        $page = 1;
        $perPage = 100;
        $rankCounter = 1;

        $bar = $this->output->createProgressBar($limit);
        $bar->start();

        do {
            // Ζητάμε από το API μόνο τα IDs για ταχύτητα, αν το API το υποστηρίζει (αλλιώς κατεβαίνουν όλα)
            $response = $this->pictufy->getArtworks([
                'page' => $page,
                'per_page' => $perPage,
                'order' => $type, // Το API καταλαβαίνει τα orders
            ]);

            $items = $response['items'] ?? [];
            if (empty($items)) break;

            foreach ($items as $item) {
                // Ενημερώνουμε απευθείας τη στήλη ranking
                // Χρησιμοποιούμε DB query για ταχύτητα αντί για Eloquent Model save()
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