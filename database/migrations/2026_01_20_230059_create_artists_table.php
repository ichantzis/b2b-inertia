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
        Schema::create('artists', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pictufy_id')->unique();
            $table->string('username')->nullable()->index(); // Use this for slugs
            $table->string('name');
            $table->text('biography')->nullable();
            $table->string('profile_picture')->nullable();
            $table->string('country')->nullable();
            $table->string('artist_type')->nullable(); // Illustrator, Photographer
            $table->integer('artwork_count')->default(0);

            // Custom Ranking for "Trending" artists pages
            $table->integer('trending_rank')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artists');
    }
};
