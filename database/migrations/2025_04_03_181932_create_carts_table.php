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
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 255)->nullable()->unique(); // For guest carts
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // For logged-in users
            $table->timestamps();

            // Ensure either session_id or user_id is present, or handle via application logic
            // You might add constraints or checks depending on your exact logic needs
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};