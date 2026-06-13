<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssistanceProgram extends Model
{
    protected $table = 'assistance_programs';

    protected $keyType = 'string';
    
    public $incrementing = false;

    protected $fillable = [
        'id',
        'title',
        'provided_by',
        'is_national',
        'phone',
        'alt_phone',
        'email',
        'fax',
        'website',
        'details',
        'summary',
        'update_date',
        'languages',
        'applications',
        'application_process',
        'eligibility_guidelines',
        'areas_of_service',
        'age_groups',
        'address',
        'services',
        'diagnoses',
    ];

    protected $casts = [
        'is_national' => 'boolean',
        'languages' => 'array',
        'applications' => 'array',
        'application_process' => 'array',
        'eligibility_guidelines' => 'array',
        'areas_of_service' => 'array',
        'age_groups' => 'array',
        'address' => 'array',
        'services' => 'array',
        'diagnoses' => 'array',
    ];
}
