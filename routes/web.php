<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::post('/auth/social-login', [\App\Http\Controllers\FirebaseAuthController::class, 'login'])->name('social.login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/onboarding', [\App\Http\Controllers\OnboardingController::class, 'show'])->name('onboarding');
    Route::post('/onboarding', [\App\Http\Controllers\OnboardingController::class, 'store']);

    Route::get('dashboard', function (\App\Services\NeedyMedsService $needyMedsService) {
        set_time_limit(120); // Allow extra time for initial API cache warmup

        if (!auth()->user()->onboarding_completed) {
            return redirect()->route('onboarding');
        }

        if (auth()->user()->role === 'super_admin') {
            return inertia('admin/dashboard');
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

    Route::get('/pharmacies', function () {
        return inertia('pharmacies/index');
    })->name('pharmacies');

    Route::get('/api/drugs/search', function (\Illuminate\Http\Request $request, \App\Services\NeedyMedsService $needyMedsService) {
        $query = $request->query('q');
        return response()->json($needyMedsService->searchDrugName($query));
    });

    Route::post('/api/drugs/pharmacies', function (\Illuminate\Http\Request $request, \App\Services\NeedyMedsService $needyMedsService) {
        $exactDrugName = $request->input('drugName');
        $userZip = auth()->user()->zip_code ?? '88595';
        $userRadius = auth()->user()->radius ?? '42';
        $quantity = $request->input('quantity', '1'); // Default to 1 or pass it from frontend

        return response()->json($needyMedsService->getPharmacyPrices($exactDrugName, $userZip, $userRadius, $quantity));
    });

    Route::get('/api/drugs/pharmacy-history', function (\Illuminate\Http\Request $request) {
        $npi = $request->query('npi');
        $drugName = $request->query('drugName');

        $history = \App\Models\PharmacyPriceHistory::where('npi', $npi)
            ->where('drug_name', $drugName)
            ->orderBy('created_at', 'asc')
            ->get()
            ->groupBy(function ($item) {
                return $item->created_at->format('Y-m-d');
            })
            ->map(function ($group) {
                $latest = $group->last();
                return [
                    'date' => \Carbon\Carbon::parse($latest->created_at)->format('M d'),
                    'price' => (float) $latest->price
                ];
            })
            ->values();

        return response()->json($history);
    });

    Route::get('/api/alarms', function () {
        return response()->json(\App\Models\PriceAlarm::where('user_id', auth()->id())->get());
    });

    Route::post('/api/alarms', function (\Illuminate\Http\Request $request) {
        $request->validate([
            'medication_name' => 'required|string',
            'last_price' => 'nullable|numeric'
        ]);

        $alarm = \App\Models\PriceAlarm::firstOrCreate([
            'user_id' => auth()->id(),
            'medication_name' => $request->input('medication_name')
        ], [
            'last_price' => $request->input('last_price')
        ]);

        return response()->json($alarm, 201);
    });

    Route::delete('/api/alarms/{id}', function ($id) {
        $alarm = \App\Models\PriceAlarm::where('user_id', auth()->id())->where('id', $id)->first();
        if ($alarm) {
            $alarm->delete();
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'Not found'], 404);
    });
});

require __DIR__.'/settings.php';
