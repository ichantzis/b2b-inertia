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


    /**
     * An artwork belongs to one Category.
     */
    public function relatedCategory() 
    {
        // Assuming 'category_id' is the foreign key in the artworks table
        // and 'pictufy_id' is the key in the categories table
        return $this->belongsTo(Category::class, 'category_id', 'pictufy_id');
    }

    /**
     * An artwork belongs to one Artist.
     */
    public function artist()
    {
        return $this->belongsTo(Artist::class, 'artist_id', 'pictufy_id');
    }

    /**
     * An artwork can belong to many Collections.
     */
    public function collections()
    {
        // The pivot table name is usually alphabetical: 'artwork_collection'
        // Foreign keys: 'artwork_id', 'collection_id' (referencing valid IDs, usually local IDs)
        // If your pivot table uses pictufy_ids, you might need to specify them.
        // Assuming standard Laravel pivot:
        return $this->belongsToMany(Collection::class, 'artwork_collection');
    }

    /**
     * An artwork can belong to many Lists.
     */
    public function artworkLists()
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
