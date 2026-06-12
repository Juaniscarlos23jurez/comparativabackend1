<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    /**
     * Store the onboarding results and mark it as completed via API.
     */
    public function store(Request $request)
    {
        $request->validate([
            'profile_data' => 'required|array',
            'profile_data.insurance' => 'required|string',
            'profile_data.age_range' => 'nullable|string',
            'profile_data.zip_code' => 'required|string|size:5',
            'profile_data.pharmacy' => 'required|string',
            'profile_data.radius' => 'required|string',
            'profile_data.plan' => 'required|string',
        ]);

        $user = $request->user();
        
        $user->update([
            'profile_data' => $request->profile_data,
            'zip_code' => $request->profile_data['zip_code'],
            'radius' => $request->profile_data['radius'],
            'onboarding_completed' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Onboarding completed successfully',
            'user' => $user
        ], 200);
    }
}
