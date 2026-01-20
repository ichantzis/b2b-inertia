<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create Artwork Lists Table
        Schema::create('artwork_lists', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pictufy_id')->unique();
            $table->string('name');
            $table->string('slug')->index(); // e.g. 'best-sellers-2025'
            $table->string('thumb')->nullable(); // Thumbnail image URL
            $table->text('description')->nullable();
            $table->integer('artwork_count')->default(0);
            $table->timestamps();
        });

        // Pivot Table: artwork_artwork_list
        Schema::create('artwork_artwork_list', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artwork_id')->constrained()->onDelete('cascade');
            $table->foreignId('artwork_list_id')->constrained()->onDelete('cascade');

            // Sort order within the list
            $table->integer('sort_order')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artwork_lists');
    }
};
