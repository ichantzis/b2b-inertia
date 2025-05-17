<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Assuming you might use factories
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory; // Good practice

    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'status',

        'billing_first_name',
        'billing_last_name',
        'billing_email',
        'billing_address',
        'billing_city',
        'billing_state_or_county',
        'billing_country',
        'billing_postal_code',
        'billing_phone',

        'wants_invoice',
        'invoice_company_name',
        'invoice_vat_number',
        'invoice_tax_office',
        'invoice_profession',

        'shipping_is_different',
        'shipping_first_name',
        'shipping_last_name',
        'shipping_email',
        'shipping_address',
        'shipping_city',
        'shipping_state_or_county',
        'shipping_country',
        'shipping_postal_code',
        'shipping_phone',

        'payment_method',
        'payment_status',
        'transaction_id',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'shipping_is_different' => 'boolean',
        'wants_invoice' => 'boolean',
        // Timestamps are automatically cast
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}