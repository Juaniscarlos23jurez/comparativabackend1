<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Handle social login from mobile app (Firebase Auth)
     */
    public function socialLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
            'uid' => 'required|string',
        ]);

        try {
            // Find the user by email or create a new one
            $user = User::firstOrCreate(
                ['email' => $request->email],
                [
                    'name' => $request->name,
                    // Generate a random secure password since they login via social provider
                    'password' => Hash::make(Str::random(32)),
                ]
            );

            if (is_null($user->email_verified_at)) {
                $user->email_verified_at = now();
                $user->save();
            }

            // Generate a Sanctum token for the mobile app
            $token = $user->createToken('MobileAppToken')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error during social login',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle standard registration from mobile app
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'onboarding_completed' => false,
            ]);

            $token = $user->createToken('MobileAppToken')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'onboarding_completed' => false,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error during registration',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle standard login from mobile app
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'message' => 'The provided credentials are incorrect.'
                ], 401);
            }

            $token = $user->createToken('MobileAppToken')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'onboarding_completed' => (bool)$user->onboarding_completed,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error during login',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Handle logout (revoke token)
     */
    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = $request->user();
        $user->name = $request->name;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Handle account deletion (permanent delete of user and all related records)
     */
    public function deleteAccount(Request $request)
    {
        $user = $request->user();
        
        try {
            // Delete user price alarms
            \App\Models\PriceAlarm::where('user_id', $user->id)->delete();
            
            // Revoke all tokens
            $user->tokens()->delete();
            
            // Delete user
            $user->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Account successfully deleted'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting account',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
