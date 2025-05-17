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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('artwork_id');  // ID from Pictufy API
            $table->string('artwork_title')->nullable(); // Title at the time of order

            // Add dedicated columns for type, frame, and size
            $table->string('type', 20)->nullable(); // Max length based on expected values
            $table->string('frame', 20)->nullable();
            $table->string('size', 10)->nullable();

            $table->decimal('price', 10, 2); // Price per unit at the time of order
            $table->integer('quantity');
            $table->json('artwork_data')->nullable(); // Store additional/snapshot artwork data (like img_thumb, original API response)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};