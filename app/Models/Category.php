<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'pictufy_id',
        'name',
        'slug',
        'parent_slug',
    ];

    /**
     * Relationship: A Category has many Artworks.
     */
    public function artworks()
    {
        return $this->hasMany(Artwork::class);
    }

    /**
     * Relationship: A Category can have many Collections.
     */
    public function collections()
    {
        return $this->hasMany(Collection::class);
    }
}