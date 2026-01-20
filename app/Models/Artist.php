<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artist extends Model
{
    use HasFactory;

    protected $fillable = [
        'pictufy_id',
        'username',
        'name',
        'biography',
        'profile_picture',
        'country',
        'artist_type', // e.g., 'Illustrator', 'Photographer'
        'artwork_count',
        'trending_rank',
    ];

    /**
     * Relationship: An Artist has many Artworks.
     */
    public function artworks()
    {
        return $this->hasMany(Artwork::class);
    }
}