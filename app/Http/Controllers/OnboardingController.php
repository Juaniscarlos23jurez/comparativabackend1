<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    /**
     * Display the onboarding wizard.
     */
    public function show()
    {
        $user = auth()->user();

        // If the user already completed the onboarding, send them directly to the dashboard
        if ($user->onboarding_completed) {
            return redirect()->route('dashboard');
        }

        return inertia('onboarding/wizard');
    }

    /**
     * Store the onboarding results and mark it as completed.
     */
    public function store(Request $request)
    {
        $request->validate([
            'profile_data' => 'required|array',
            'profile_data.insurance' => 'required|string',
            'profile_data.zip_code' => 'required|string|size:5',
            'profile_data.pharmacy' => 'required|string',
            'profile_data.radius' => 'required|string',
            'profile_data.plan' => 'required|string',
        ]);

        $user = auth()->user();
        
        $user->update([
            'profile_data' => $request->profile_data,
            'zip_code' => $request->profile_data['zip_code'],
            'radius' => $request->profile_data['radius'],
            'onboarding_completed' => true,
        ]);

        return redirect()->route('dashboard');
    }
}
