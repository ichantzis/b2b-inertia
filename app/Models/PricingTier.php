<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingTier extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'discount_percentage'];

    // Μια βαθμίδα έχει πολλούς χρήστες
    public function users()
    {
        return $this->hasMany(User::class);
    }
}