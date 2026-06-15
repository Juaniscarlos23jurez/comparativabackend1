<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Insert default settings from current configuration
        \Illuminate\Support\Facades\DB::table('settings')->insert([
            [
                'key' => 'min_version',
                'value' => env('APP_MIN_VERSION', '1.0.0'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'latest_version',
                'value' => env('APP_LATEST_VERSION', '1.0.0'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'app_store_url',
                'value' => env('APP_STORE_URL', 'https://apps.apple.com/app/id123456789'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'play_store_url',
                'value' => env('PLAY_STORE_URL', 'https://play.google.com/store/apps/details?id=com.example.app'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
