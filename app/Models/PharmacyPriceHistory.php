<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PharmacyPriceHistory extends Model
{
    protected $fillable = [
        'npi',
        'pharmacy_name',
        'pharmacy_brand',
        'drug_name',
        'price',
        'discount_price'
    ];
}
