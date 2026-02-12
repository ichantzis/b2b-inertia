<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Good to add if you'll use factories
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory; // Add HasFactory trait

    protected $fillable = [
        'order_id',
        'artwork_id',
        'artwork_title',
        'type',
        'print_type',
        'frame',            // Added
        'size',             // Added
        'price',
        'quantity',
        'artwork_data',     // Keep for other details like image URL, etc.
    ];

    protected $casts = [
        'artwork_data' => 'array',
        'price' => 'decimal:2', // Good practice to cast decimal fields
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
