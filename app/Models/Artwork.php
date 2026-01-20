<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artwork extends Model
{
    use HasFactory;

    protected $fillable = [
        'pictufy_id',
        'title',
        'artist',
        'artist_id',
        'category',
        'category_id',
        'keywords',
        'geometry',
        'width',
        'height',
        'best_seller_rank',
        'trending_rank',
        'grade',
        'img_thumb',
        'img_medium',
        'img_high',
        'has_red',
        'has_orange',
        'has_yellow',
        'has_green',
        'has_turquoise',
        'has_blue',
        'has_lilac',
        'has_pink',
        'is_highkey',
        'is_lowkey',
        'artwork_published_at',
    ];

    protected $casts = [
        'artwork_published_at' => 'datetime',
        'has_red' => 'boolean',
        'has_orange' => 'boolean',
        'has_yellow' => 'boolean',
        'has_green' => 'boolean',
        'has_turquoise' => 'boolean',
        'has_blue' => 'boolean',
        'has_lilac' => 'boolean',
        'has_pink' => 'boolean',
        'is_highkey' => 'boolean',
        'is_lowkey' => 'boolean',
    ];


    public function artworksLists()
    {
        return $this->belongsToMany(ArtworkList::class, 'artwork_artwork_list');
    }

    /**
     * Accessor to generate Interior URLs dynamically on the frontend side 
     * or here if you want them in the JSON response.
     * * Example usage in Vue: 
     * `https://pictufy.com/api/interiors.php?p=${artwork.pictufy_id}&i=28`
     */
}
