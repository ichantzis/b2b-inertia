<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Δημιουργία πίνακα για τις Κατηγορίες Συλλογών
        Schema::create('collection_categories', function (Blueprint $table) {
            $table->id();
            $table->string('pictufy_id')->unique(); // π.χ. 95d525b26775467c40f09d2f59567c35
            $table->string('name'); // π.χ. Key Trends
            $table->string('slug')->index();
            $table->timestamps();
        });

        // 2. Αφαίρεση των παλιών στηλών από τον πίνακα collections
        Schema::table('collections', function (Blueprint $table) {
            $table->dropColumn(['category_id', 'category_name']);
        });

        // 3. Δημιουργία Pivot πίνακα για τη σχέση Many-to-Many
        Schema::create('collection_collection_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_id')->constrained()->onDelete('cascade');
            $table->foreignId('collection_category_id')->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('collection_collection_category');
        Schema::dropIfExists('collection_categories');
        
        Schema::table('collections', function (Blueprint $table) {
            $table->string('category_id')->nullable()->index();
            $table->string('category_name')->nullable();
        });
    }
};