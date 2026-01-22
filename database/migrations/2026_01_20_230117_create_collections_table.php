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
        // 1. Create the Collections Table
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->string('pictufy_id')->unique();
            $table->string('name');
            $table->string('slug')->index();
            $table->string('thumb')->nullable();
            $table->text('description')->nullable();
            $table->integer('artwork_count')->default(0);
            $table->string('category_id')->nullable()->index();
            $table->timestamps();
        });

        // 2. Create the Pivot Table (Artworks <-> Collections)
        Schema::create('artwork_collection', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artwork_id')->constrained()->onDelete('cascade');
            $table->foreignId('collection_id')->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artwork_collection');
        Schema::dropIfExists('collections');
    }
};
