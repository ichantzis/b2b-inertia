<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtworkList extends Model
{
    use HasFactory;

    protected $fillable = [
        'pictufy_id',
        'name',
        'slug',
        'cover',      
        'description',
        'last_change',
    ];

    // Many-to-Many relationship with projects
    public function artworks()
    {
        return $this->belongsToMany(Artwork::class, 'artwork_artwork_list')
                    ->withPivot('sort_order')
                    ->orderByPivot('sort_order', 'asc');
    }
}