<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clinic extends Model
{
    protected $table = 'clinics';

    protected $keyType = 'string';
    
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'address',
        'address2',
        'city',
        'state',
        'postal_code',
        'phone',
        'website',
        'fees',
        'income',
        'hours',
        'accepts',
        'languages_spoken',
        'service_area',
        'is_dental',
        'is_medical',
        'is_mental_health',
        'is_substance',
        'location',
    ];

    protected $casts = [
        'is_dental' => 'boolean',
        'is_medical' => 'boolean',
        'is_mental_health' => 'boolean',
        'is_substance' => 'boolean',
        'accepts' => 'array',
        'languages_spoken' => 'array',
        'service_area' => 'array',
        'location' => 'array',
    ];
}
