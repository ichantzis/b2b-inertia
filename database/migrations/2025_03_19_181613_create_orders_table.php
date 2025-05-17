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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('order_number')->unique();
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['pending', 'processing', 'completed', 'shipped', 'delivered', 'cancelled', 'refunded'])->default('pending'); // Added more statuses

            // Billing Information
            $table->string('billing_first_name');
            $table->string('billing_last_name');
            $table->string('billing_email');
            $table->string('billing_address');
            $table->string('billing_city');
            $table->string('billing_state_or_county')->nullable();
            $table->string('billing_country', 50); // Increased size for country name if not using codes
            $table->string('billing_postal_code', 20);
            $table->string('billing_phone', 30)->nullable();

            // Invoice Details (optional, tied to billing entity)
            $table->boolean('wants_invoice')->default(false);
            $table->string('invoice_company_name')->nullable();
            $table->string('invoice_vat_number', 50)->nullable(); // Increased size
            $table->string('invoice_tax_office', 100)->nullable(); // Increased size
            $table->string('invoice_profession', 100)->nullable(); // Increased size

            // Shipping Information
            $table->boolean('shipping_is_different')->default(false);
            // Shipping fields will store billing info if shipping_is_different is false,
            // or different shipping info if true.
            $table->string('shipping_first_name');
            $table->string('shipping_last_name');
            $table->string('shipping_email')->nullable(); // Often shipping email is same as billing, can be optional
            $table->string('shipping_address');
            $table->string('shipping_city');
            $table->string('shipping_state_or_county')->nullable();
            $table->string('shipping_country', 50); // Increased size
            $table->string('shipping_postal_code', 20);
            $table->string('shipping_phone', 30)->nullable();

            // Payment & Order Notes
            $table->string('payment_method');
            $table->string('payment_status')->default('pending');
            $table->string('transaction_id')->nullable()->comment('For payment gateway transaction reference'); // Good to have
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};