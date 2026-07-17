<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ArtworkList extends Model
{
    use HasFactory;

    protected $fillable = [
        'pictufy_id',
        'name',
        'slug',
        'cover',
        'custom_cover_path', // Νέο πεδίο
        'description',
        'custom_description', // Νέο πεδίο
        'last_change',
    ];

    // Κάνουμε append τα νέα attributes για να είναι διαθέσιμα στο JSON (Vue)
    protected $appends = ['resolved_cover', 'resolved_description'];

    /**
     * Επιστρέφει το custom εξώφυλλο (αν υπάρχει) ή το προεπιλεγμένο.
     */
    public function getResolvedCoverAttribute()
    {
        if ($this->custom_cover_path) {
            return Storage::url($this->custom_cover_path);
        }
        return $this->cover;
    }

    /**
     * Επιστρέφει την custom περιγραφή (αν υπάρχει) ή την προεπιλεγμένη.
     */
    public function getResolvedDescriptionAttribute()
    {
        return $this->custom_description ?? $this->description;
    }

    // Many-to-Many relationship with projects
    public function artworks()
    {
        return $this->belongsToMany(Artwork::class, 'artwork_artwork_list')
                    ->withPivot('sort_order')
                    ->orderByPivot('sort_order', 'asc');
    }
}