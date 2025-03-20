<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'artwork_id',
        'artwork_title',
        'price',
        'quantity',
        'artwork_data',
    ];

    protected $casts = [
        'artwork_data' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
