<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceAlarm extends Model
{
    protected $fillable = [
        'user_id',
        'medication_name',
        'last_price'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
