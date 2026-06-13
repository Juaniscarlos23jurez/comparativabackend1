<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diagnosis extends Model
{
    protected $table = 'diagnoses';

    protected $keyType = 'string';
    
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'details',
        'has_detail',
        'last_update',
    ];

    protected $casts = [
        'has_detail' => 'boolean',
    ];
}
