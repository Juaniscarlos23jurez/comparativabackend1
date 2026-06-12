<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\NeedyMedsService;

class OptimizerController extends Controller
{
    public function calculate(Request $request, NeedyMedsService $needyMedsService)
    {
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
    }
}
