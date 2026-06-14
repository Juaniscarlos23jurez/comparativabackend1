<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::post('/auth/social-login', [\App\Http\Controllers\FirebaseAuthController::class, 'login'])->name('social.login');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/onboarding', [\App\Http\Controllers\OnboardingController::class, 'show'])->name('onboarding');
    Route::post('/onboarding', [\App\Http\Controllers\OnboardingController::class, 'store']);

    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/users', [\App\Http\Controllers\AdminController::class, 'users']);
        Route::get('/statistics', [\App\Http\Controllers\AdminController::class, 'statistics']);
        Route::get('/activity', [\App\Http\Controllers\AdminController::class, 'activity']);
        Route::get('/reports', [\App\Http\Controllers\AdminController::class, 'reports']);
    });

    Route::get('dashboard', function (\App\Services\NeedyMedsService $needyMedsService) {
        set_time_limit(120); // Allow extra time for initial API cache warmup

        if (auth()->user()->role === 'super_admin') {
            $totalUsers = \App\Models\User::count();
            
            // Real recent users
            $recentUsers = \App\Models\User::orderBy('created_at', 'desc')->take(4)->get();
            
            // Mix users and alarms to create real activity feed
            $userActivities = \App\Models\User::orderBy('created_at', 'desc')->take(5)->get()->map(function ($user) {
                return [
                    'id' => 'u_'.$user->id,
                    'type' => 'user_signup',
                    'title' => 'Nuevo Registro',
                    'description' => "El usuario {$user->name} se ha registrado.",
                    'created_at' => $user->created_at,
                ];
            });
            
            $alarmActivities = \App\Models\PriceAlarm::with('user')->orderBy('created_at', 'desc')->take(5)->get()->map(function ($alarm) {
                return [
                    'id' => 'a_'.$alarm->id,
                    'type' => 'price_alarm',
                    'title' => 'Alarma Creada',
                    'description' => ($alarm->user->name ?? 'Un usuario')." configuró una alarma para {$alarm->medication_name}.",
                    'created_at' => $alarm->created_at,
                ];
            });
            
            $recentActivities = collect($userActivities)->concat($alarmActivities)->sortByDesc('created_at')->take(4)->values();

            return inertia('admin/dashboard', [
                'stats' => [
                    'totalUsers' => $totalUsers,
                    'totalLookups' => 142000,
                    'estSavings' => 1200000,
                    'totalRevenue' => 45231
                ],
                'recentUsers' => $recentUsers,
                'recentActivities' => $recentActivities
            ]);
        }

        if (!auth()->user()->onboarding_completed) {
            return redirect()->route('onboarding');
        }

        $medications = \App\Models\TrackedMedication::orderBy('rank')->get();
        
        $userZip = auth()->user()->zip_code ?? '88595';
        $userRadius = auth()->user()->radius ?? '42';

        $medicationsList = $medications->map(function ($med) use ($needyMedsService, $userZip, $userRadius) {
            // Fetch cached price or call NeedyMeds API
            $pricing = $needyMedsService->getMedicationPrices($med, $userZip, $userRadius, $med->default_quantity);
            
            // Calculate 30d change (mocked if not available from API)
            // Realistically we would store historical prices in DB, but for now we generate a mock or 0
            $change = rand(-150, 50) / 10;

            return [
                'id' => strtolower($med->name),
                'rank' => $med->rank,
                'name' => $med->name,
                'exactName' => $pricing ? $pricing['exactName'] : $med->name,
                'generic' => $med->generic_name,
                'category' => $med->category,
                'retail' => $pricing ? $pricing['retail'] : 1000,
                'bestPrice' => $pricing ? $pricing['bestPrice'] : 0,
                'change' => $change,
            ];
        });

        return inertia('dashboard', [
            'medicationsList' => $medicationsList
        ]);
    })->name('dashboard');

    Route::get('/medications/{id}', function ($id, \App\Services\NeedyMedsService $needyMedsService) {
        $med = \App\Models\TrackedMedication::whereRaw('LOWER(name) = ?', [strtolower($id)])->first();
        if (!$med) {
            abort(404);
        }

        $userZip = auth()->user()->zip_code ?? '88595';
        $userRadius = auth()->user()->radius ?? '42';
        $pricing = $needyMedsService->getMedicationPrices($med, $userZip, $userRadius, $med->default_quantity);

        return inertia('medications/show', [
            'medication' => [
                'id' => strtolower($med->name),
                'name' => $med->name,
                'generic' => $med->generic_name,
                'category' => $med->category,
                'rank' => $med->rank,
                'bestPrice' => $pricing ? $pricing['bestPrice'] : 850,
                'retail' => $pricing ? $pricing['retail'] : 1000,
            ]
        ]);
    })->name('medications.show');

    Route::get('/alarms', function () {
        return inertia('alarms/index');
    })->name('alarms');

    Route::get('/optimizer', function () {
        return inertia('optimizer/index');
    })->name('optimizer');

    Route::redirect('/savings', '/optimizer');
    Route::redirect('/pharmacies', '/optimizer');



    Route::get('/programs', function () {
        return inertia('programs/index');
    })->name('programs');



    Route::get('/coupons', function () {
        return inertia('coupons/index');
    })->name('coupons');



    Route::get('/diagnoses', function () {
        return inertia('diagnoses/index');
    })->name('diagnoses');



    Route::get('/clinics', function () {
        return inertia('clinics/index');
    })->name('clinics');


});

require __DIR__.'/settings.php';
