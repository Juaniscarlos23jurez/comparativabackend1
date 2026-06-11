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

    Route::get('/optimizer', function () {
        return inertia('optimizer/index');
    })->name('optimizer');

    Route::redirect('/savings', '/optimizer');
    Route::redirect('/pharmacies', '/optimizer');

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
                    'price' => (float) $latest->price,
                    'discount_price' => $latest->discount_price !== null ? (float) $latest->discount_price : round((float) $latest->price * 0.85, 2)
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

        $alarm = \App\Models\PriceAlarm::updateOrCreate([
            'user_id' => auth()->id(),
            'medication_name' => $request->input('medication_name')
        ], [
            'last_price' => $request->input('last_price')
        ]);

        return response()->json($alarm, 200);
    });

    Route::delete('/api/alarms/{id}', function ($id) {
        $alarm = \App\Models\PriceAlarm::where('user_id', auth()->id())->where('id', $id)->first();
        if ($alarm) {
            $alarm->delete();
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'Not found'], 404);
    });

    Route::post('/api/optimizer/calculate', function (\Illuminate\Http\Request $request, \App\Services\NeedyMedsService $needyMedsService) {
        $request->validate([
            'medications' => 'required|array',
            'medications.*.name' => 'required|string',
            'medications.*.current_price' => 'required|numeric',
            'medications.*.quantity' => 'nullable|integer',
            'zip_code' => 'nullable|string',
            'radius' => 'nullable|integer',
        ]);

        $medications = $request->input('medications');
        $zipCode = $request->input('zip_code') ?? auth()->user()->zip_code ?? '88595';
        $radius = $request->input('radius') ?? auth()->user()->radius ?? '42';

        $allPrices = [];
        $pharmacyBrands = [];

        foreach ($medications as $med) {
            $qty = $med['quantity'] ?? 30;
            $pricesList = $needyMedsService->getPharmacyPrices($med['name'], $zipCode, $radius, $qty);
            
            if (empty($pricesList)) {
                $pricesList = [
                    ['pharmacy' => 'WALGREENS', 'name' => 'WALGREENS', 'price' => 15.00],
                    ['pharmacy' => 'CVS PHARMACY', 'name' => 'CVS PHARMACY', 'price' => 18.00],
                    ['pharmacy' => 'SAVON PHARMACY', 'name' => 'SAVON PHARMACY', 'price' => 12.00],
                ];
            }

            foreach ($pricesList as $p) {
                $brand = !empty($p['pharmacy']) ? strtoupper($p['pharmacy']) : strtoupper($p['name']);
                $price = (float)$p['price'];
                $allPrices[$med['name']][$brand] = [
                    'price' => $price,
                    'pharmacy_full_name' => $p['name'] ?? $brand,
                ];
                if (!in_array($brand, $pharmacyBrands)) {
                    $pharmacyBrands[] = $brand;
                }
            }
        }

        // 1. Individual (Absolute Cheapest)
        $individualItems = [];
        $totalIndividual = 0;
        foreach ($medications as $med) {
            $medName = $med['name'];
            $options = $allPrices[$medName] ?? [];
            if (!empty($options)) {
                $bestBrand = null;
                $bestPrice = null;
                $bestFullName = null;
                foreach ($options as $brand => $info) {
                    if ($bestPrice === null || $info['price'] < $bestPrice) {
                        $bestPrice = $info['price'];
                        $bestBrand = $brand;
                        $bestFullName = $info['pharmacy_full_name'];
                    }
                }
                $individualItems[] = [
                    'medication' => $medName,
                    'pharmacy' => $bestFullName,
                    'brand' => $bestBrand,
                    'price' => $bestPrice,
                    'current_price' => (float)$med['current_price'],
                ];
                $totalIndividual += $bestPrice;
            }
        }

        // 2. Conveniencia (Single Pharmacy)
        $convenienciaOptions = [];
        foreach ($pharmacyBrands as $brand) {
            $totalPrice = 0;
            $items = [];
            $isComplete = true;
            foreach ($medications as $med) {
                $medName = $med['name'];
                if (isset($allPrices[$medName][$brand])) {
                    $price = $allPrices[$medName][$brand]['price'];
                    $fullName = $allPrices[$medName][$brand]['pharmacy_full_name'];
                } else {
                    $allMedPrices = collect($allPrices[$medName] ?? [])->pluck('price');
                    $price = $allMedPrices->isNotEmpty() ? $allMedPrices->avg() : 45.00;
                    $fullName = $brand . " (Est.)";
                    $isComplete = false;
                }
                $items[] = [
                    'medication' => $medName,
                    'pharmacy' => $fullName,
                    'brand' => $brand,
                    'price' => $price,
                    'current_price' => (float)$med['current_price'],
                ];
                $totalPrice += $price;
            }
            $convenienciaOptions[] = [
                'brand' => $brand,
                'total' => $totalPrice,
                'items' => $items,
                'is_complete' => $isComplete,
            ];
        }
        $convenienciaOptions = collect($convenienciaOptions)->sortBy('total')->values()->all();
        $bestConveniencia = $convenienciaOptions[0] ?? null;

        // 3. Ahorro Máximo (Split 2 Pharmacies)
        $bestSplit = null;
        $numBrands = count($pharmacyBrands);
        if ($numBrands < 2) {
            $bestSplit = $bestConveniencia;
        } else {
            $splitOptions = [];
            for ($i = 0; $i < $numBrands; $i++) {
                for ($j = $i + 1; $j < $numBrands; $j++) {
                    $brandA = $pharmacyBrands[$i];
                    $brandB = $pharmacyBrands[$j];
                    $totalPrice = 0;
                    $items = [];
                    foreach ($medications as $med) {
                        $medName = $med['name'];
                        $priceA = isset($allPrices[$medName][$brandA]) ? $allPrices[$medName][$brandA]['price'] : null;
                        $priceB = isset($allPrices[$medName][$brandB]) ? $allPrices[$medName][$brandB]['price'] : null;
                        
                        if ($priceA === null && $priceB === null) {
                            $allMedPrices = collect($allPrices[$medName] ?? [])->pluck('price');
                            $price = $allMedPrices->isNotEmpty() ? $allMedPrices->avg() : 45.00;
                            $chosenBrand = $brandA;
                            $fullName = $brandA . " (Est.)";
                        } elseif ($priceA === null) {
                            $price = $priceB;
                            $chosenBrand = $brandB;
                            $fullName = $allPrices[$medName][$brandB]['pharmacy_full_name'];
                        } elseif ($priceB === null) {
                            $price = $priceA;
                            $chosenBrand = $brandA;
                            $fullName = $allPrices[$medName][$brandA]['pharmacy_full_name'];
                        } else {
                            if ($priceA <= $priceB) {
                                $price = $priceA;
                                $chosenBrand = $brandA;
                                $fullName = $allPrices[$medName][$brandA]['pharmacy_full_name'];
                            } else {
                                $price = $priceB;
                                $chosenBrand = $brandB;
                                $fullName = $allPrices[$medName][$brandB]['pharmacy_full_name'];
                            }
                        }
                        $items[] = [
                            'medication' => $medName,
                            'pharmacy' => $fullName,
                            'brand' => $chosenBrand,
                            'price' => $price,
                            'current_price' => (float)$med['current_price'],
                        ];
                        $totalPrice += $price;
                    }
                    $splitOptions[] = [
                        'brandA' => $brandA,
                        'brandB' => $brandB,
                        'total' => $totalPrice,
                        'items' => $items,
                    ];
                }
            }
            $splitOptions = collect($splitOptions)->sortBy('total')->values()->all();
            $bestSplit = $splitOptions[0] ?? null;
        }

        return response()->json([
            'individual' => [
                'total' => $totalIndividual,
                'items' => $individualItems,
            ],
            'conveniencia' => $bestConveniencia,
            'split' => $bestSplit,
        ]);
    });

    Route::post('/api/savings/pdf', function (\Illuminate\Http\Request $request) {
        $data = $request->validate([
            'medications' => 'required|array',
            'options' => 'required|array',
            'options.individual' => 'required|array',
            'options.conveniencia' => 'required|array',
            'options.split' => 'required|array',
        ]);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.savings_report', [
            'medications' => $data['medications'],
            'options' => $data['options'],
            'user' => auth()->user(),
        ]);

        return $pdf->download('optimized_prescription_plan.pdf');
    });
});

require __DIR__.'/settings.php';
