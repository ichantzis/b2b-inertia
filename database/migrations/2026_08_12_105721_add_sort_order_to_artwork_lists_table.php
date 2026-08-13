<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('artwork_lists', function (Blueprint $table) {
            // Προσθέτουμε προεπιλογή το 999 ώστε οι νέες/αταξινόμητες λίστες να πηγαίνουν στο τέλος
            $table->integer('sort_order')->default(999)->after('id');
        });
    }

    public function down()
    {
        Schema::table('artwork_lists', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }
};