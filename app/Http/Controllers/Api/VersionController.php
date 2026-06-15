<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class VersionController extends Controller
{
    /**
     * Get the app version details.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'min_version' => Setting::getValue('min_version', env('APP_MIN_VERSION', '1.0.0')),
                'latest_version' => Setting::getValue('latest_version', env('APP_LATEST_VERSION', '1.0.0')),
                'app_store_url' => Setting::getValue('app_store_url', env('APP_STORE_URL', 'https://apps.apple.com/app/id123456789')),
                'play_store_url' => Setting::getValue('play_store_url', env('PLAY_STORE_URL', 'https://play.google.com/store/apps/details?id=com.example.app')),
            ]
        ]);
    }
}
