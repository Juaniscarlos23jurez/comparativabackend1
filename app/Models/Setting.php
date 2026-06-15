<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'value'])]
class Setting extends Model
{
    /**
     * Get a setting value by key.
     *
     * @param string $key
     * @param mixed $default
     * @return string|null
     */
    public static function getValue(string $key, $default = null): ?string
    {
        $setting = self::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a setting value by key.
     *
     * @param string $key
     * @param string|null $value
     * @return Setting
     */
    public static function setValue(string $key, ?string $value): Setting
    {
        return self::updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
