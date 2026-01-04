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
        Schema::table('orders', function (Blueprint $table) {
            // Ensure it is unique and indexed for fast lookups
            $table->string('order_number')->unique()->change();
            // If it's already created, just: $table->index('order_number');
        });
    }

};
