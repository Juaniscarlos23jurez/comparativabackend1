<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackedMedication extends Model
{
    protected $fillable = [
        'name',
        'search_name',
        'generic_name',
        'category',
        'default_quantity',
        'rank'
    ];
}
