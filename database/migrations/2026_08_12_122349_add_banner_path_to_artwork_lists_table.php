<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('artwork_lists', function (Blueprint $table) {
            // Προσθέτουμε τη στήλη για το banner path μετά το cover
            $table->string('custom_banner_path')->nullable()->after('custom_cover_path');
        });
    }

    public function down()
    {
        Schema::table('artwork_lists', function (Blueprint $table) {
            $table->dropColumn('custom_banner_path');
        });
    }
};