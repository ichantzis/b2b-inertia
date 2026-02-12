<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->string('print_type')->default('mono')->after('type');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->string('print_type')->default('mono')->after('type');
        });
    }

    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropColumn('print_type');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('print_type');
        });
    }
};