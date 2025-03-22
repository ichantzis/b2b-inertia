<?php

namespace App\Console\Commands;

use App\Services\PictufyService;
use Illuminate\Console\Command;

class RefreshPictufyCache extends Command
{
    protected $signature = 'pictufy:refresh-cache';
    protected $description = 'Refresh the Pictufy lists cache';

    public function handle(PictufyService $pictufyService)
    {
        $this->info('Refreshing Pictufy lists cache...');
        $pictufyService->refreshListsCache();
        $this->info('Cache refreshed successfully!');
    }
}