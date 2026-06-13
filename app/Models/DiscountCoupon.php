<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountCoupon extends Model
{
    protected $table = 'discount_coupons';

    protected $keyType = 'string';
    
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'details',
        'expiration_date',
        'last_updated',
        'manufacturer_offer_website',
        'patient_support_number',
        'pharmacy_support_number',
        'print_pdf',
        'activate_by',
        'category',
        'coverage_requirements',
        'offer_type',
        'over_the_counter',
        'drugs',
    ];

    protected $casts = [
        'over_the_counter' => 'boolean',
        'drugs' => 'array',
    ];
}
