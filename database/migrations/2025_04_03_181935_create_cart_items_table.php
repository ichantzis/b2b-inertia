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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->onDelete('cascade');

            // --- Specify reasonable lengths ---
            $table->string('artwork_id', 50); // Adjust length as needed
            $table->string('type', 20);       // Adjust length as needed
            $table->string('frame', 20);      // Adjust length as needed
            $table->string('size', 10);       // Adjust length as needed
            // ---------------------------------

            $table->integer('quantity')->default(1);
            $table->json('artwork_data')->nullable();
            $table->timestamps();

            // Unique constraint - should now be within limits
            $table->unique(['cart_id', 'artwork_id', 'type', 'frame', 'size'], 'cart_items_variation_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};