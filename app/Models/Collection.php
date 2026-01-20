<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    use HasFactory;

    protected $fillable = [
        'pictufy_id',
        'name',
        'slug',
        'thumb',
        'description',
        'artwork_count',
        'category_id',
    ];

    /**
     * Relationship: A Collection belongs to a Category (optional).
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relationship: A Collection belongs to many Artworks (Many-to-Many).
     */
    public function artworks()
    {
        return $this->belongsToMany(Artwork::class, 'artwork_collection');
    }
}