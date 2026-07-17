<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            // Ελέγχουμε αν ΔΕΝ υπάρχει η στήλη πριν προσπαθήσουμε να την προσθέσουμε
            if (!Schema::hasColumn('cart_items', 'print_type')) {
                $table->string('print_type')->default('mono')->after('type');
            }
        });

        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'print_type')) {
                $table->string('print_type')->default('mono')->after('type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            if (Schema::hasColumn('cart_items', 'print_type')) {
                $table->dropColumn('print_type');
            }
        });

        Schema::table('order_items', function (Blueprint $table) {
            if (Schema::hasColumn('order_items', 'print_type')) {
                $table->dropColumn('print_type');
            }
        });
    }
};
