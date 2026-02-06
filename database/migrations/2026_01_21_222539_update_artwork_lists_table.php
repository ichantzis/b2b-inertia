<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artwork_lists', function (Blueprint $table) {
            // Rename 'thumb' to 'cover'
            $table->renameColumn('thumb', 'cover');
            
            // Add 'last_change' column
            $table->dateTime('last_change')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('artwork_lists', function (Blueprint $table) {
            $table->renameColumn('cover', 'thumb');
            $table->dropColumn('last_change');
        });
    }
};