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
        Schema::create('artworks', function (Blueprint $table) {
            $table->id();
            
            // Core ID from Pictufy (Unique)
            $table->unsignedBigInteger('pictufy_id')->unique()->index();

            // Basic Info
            $table->string('title'); // We will store the 'en' version
            $table->string('artist');
            $table->unsignedBigInteger('artist_id')->index();
            $table->string('category');
            $table->unsignedBigInteger('category_id')->index();
            
            // Search & Filters
            $table->text('keywords'); // Full string of keywords
            $table->string('geometry')->index(); // 'vertical', 'horizontal', 'square'
            $table->integer('width');
            $table->integer('height');
            
            // Ranking & Sorting Columns (for your custom filters)
            $table->unsignedInteger('best_seller_rank')->nullable()->index(); 
            $table->unsignedInteger('trending_rank')->nullable()->index();
            $table->unsignedTinyInteger('grade')->default(0)->index(); // Quality grade

            // URLs (Storing only the main image variations)
            $table->string('img_thumb')->nullable();
            $table->string('img_medium')->nullable();
            $table->string('img_high')->nullable();
            
            // Boolean Colors for fast filtering
            $table->boolean('has_red')->default(false);
            $table->boolean('has_orange')->default(false);
            $table->boolean('has_yellow')->default(false);
            $table->boolean('has_green')->default(false);
            $table->boolean('has_turquoise')->default(false);
            $table->boolean('has_blue')->default(false);
            $table->boolean('has_lilac')->default(false);
            $table->boolean('has_pink')->default(false);
            $table->boolean('is_highkey')->default(false); // Light/White dominant
            $table->boolean('is_lowkey')->default(false);  // Dark/Black dominant

            // Metadata
            $table->timestamp('artwork_published_at')->nullable();
            $table->timestamps();

            // Compound Index for common filtered queries (Category + Geometry is very common)
            $table->index(['category_id', 'geometry']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artworks');
    }
};