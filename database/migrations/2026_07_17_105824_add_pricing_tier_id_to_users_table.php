<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Αν είχες ήδη φτιάξει τη στήλη discount_percentage από το προηγούμενο βήμα, την αφαιρούμε:
            if (Schema::hasColumn('users', 'discount_percentage')) {
                $table->dropColumn('discount_percentage');
            }

            // Προσθέτουμε το ξένο κλειδί. To nullable() σημαίνει ότι αν δεν έχει, παίρνει τη Default τιμολόγηση.
            $table->foreignId('pricing_tier_id')->nullable()->constrained('pricing_tiers')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['pricing_tier_id']);
            $table->dropColumn('pricing_tier_id');
        });
    }
};