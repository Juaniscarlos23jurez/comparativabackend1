<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FirebaseAuthController extends Controller
{
    /**
     * Handle the incoming request from Firebase Auth via frontend.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
            'uid' => 'required|string',
        ]);

        // Find the user by email or create a new one
        $user = User::firstOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->name,
                // Generate a random secure password since they login via social provider
                'password' => Hash::make(Str::random(32)),
                // Role defaults to 'user' based on our database schema
            ]
        );

        if (is_null($user->email_verified_at)) {
            $user->email_verified_at = now();
            $user->save();
        }

        // Log the user into the Laravel session
        Auth::login($user);

        // Regenerate the session to protect against session fixation
        $request->session()->regenerate();

        // Redirect to intended route or dashboard
        return redirect()->intended(route('dashboard', absolute: false));
    }
}
