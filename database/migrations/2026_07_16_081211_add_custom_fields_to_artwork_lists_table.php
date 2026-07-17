<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artwork_lists', function (Blueprint $table) {
            $table->string('custom_cover_path')->nullable()->after('cover');
            $table->text('custom_description')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('artwork_lists', function (Blueprint $table) {
            $table->dropColumn(['custom_cover_path', 'custom_description']);
        });
    }
};