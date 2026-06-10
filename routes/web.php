<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::post('/auth/social-login', [\App\Http\Controllers\FirebaseAuthController::class, 'login'])->name('social.login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/onboarding', [\App\Http\Controllers\OnboardingController::class, 'show'])->name('onboarding');
    Route::post('/onboarding', [\App\Http\Controllers\OnboardingController::class, 'store']);

    Route::get('dashboard', function () {
        if (!auth()->user()->onboarding_completed) {
            return redirect()->route('onboarding');
        }

        if (auth()->user()->role === 'super_admin') {
            return inertia('admin/dashboard');
        }

        return inertia('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
