<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CollectionCategory extends Model
{
    protected $guarded = [];

    public function collections()
    {
        return $this->belongsToMany(Collection::class, 'collection_collection_category');
    }
}