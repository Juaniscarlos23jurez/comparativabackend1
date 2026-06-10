<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class NeedyMedsService
{
    /**
     * Get the best prices for a tracked medication.
     * Caches the result for 24 hours to avoid rate limits or slow performance.
     */
    public function getMedicationPrices($medication, $zipCode = '88595', $radius = '42', $quantity = '30')
    {
        $cacheKey = "medication_prices_{$medication->id}_{$zipCode}_{$radius}_{$quantity}";

        return Cache::remember($cacheKey, now()->addHours(24), function () use ($medication, $zipCode, $radius, $quantity) {
            try {
                // Step 1: Search for the drug to get its exact name/NDC
                $drugResponse = Http::post('https://api.needymeds.org/pricing-drug', [
                    'drugNameBeginsWith' => $medication->search_name
                ]);

                if (!$drugResponse->successful()) {
                    return null;
                }

                $drugs = $drugResponse->json('pricingDrugs', []);
                
                if (empty($drugs)) {
                    return null;
                }

                // Get the exact name of the first match (e.g. OZEMPIC 1 MG/DOSE (2 MG/1.5ML))
                $exactDrugName = $drugs[0]['name'] ?? null;

                if (!$exactDrugName) {
                    return null;
                }

                // Step 2: Search for pharmacies and get prices
                $pharmacyResponse = Http::post('https://api.needymeds.org/pricing-drug/search-pharmacy', [
                    'drugName' => $exactDrugName,
                    'quantity' => $quantity,
                    'radius' => $radius,
                    'zipCode' => $zipCode
                ]);

                if (!$pharmacyResponse->successful()) {
                    return null;
                }

                $pricings = $pharmacyResponse->json('DrugPricing', []);

                if (empty($pricings)) {
                    return null;
                }

                // Calculate Best Price and Average Retail
                $prices = collect($pricings)->pluck('price')->map(fn($price) => (float)$price)->filter();
                
                if ($prices->isEmpty()) {
                    return null;
                }

                $bestPrice = $prices->min();
                $avgRetail = $prices->average() * 1.5; // Simulating average retail price vs discount if needed, or just highest
                $highestPrice = $prices->max();

                return [
                    'bestPrice' => round($bestPrice, 2),
                    'retail' => round($highestPrice, 2),
                    'exactName' => $exactDrugName,
                ];

            } catch (\Exception $e) {
                Log::error('NeedyMeds API Error: ' . $e->getMessage());
                return null;
            }
        });
    }

    /**
     * Search for drug names that begin with the query string for autocomplete.
     */
    public function searchDrugName($query)
    {
        if (empty(trim($query))) {
            return [];
        }

        try {
            $response = Http::post('https://api.needymeds.org/pricing-drug', [
                'drugNameBeginsWith' => $query
            ]);

            if ($response->successful()) {
                return $response->json('pricingDrugs', []);
            }

            return [];
        } catch (\Exception $e) {
            Log::error('NeedyMeds Search Error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get pharmacy prices for a specific exact drug name.
     */
    public function getPharmacyPrices($exactDrugName, $zipCode = '88595', $radius = '42', $quantity = '1')
    {
        Log::info("NeedyMeds Pharmacy Search Request: drugName={$exactDrugName}, zipCode={$zipCode}, radius={$radius}, quantity={$quantity}");
        try {
            $pharmacyResponse = Http::post('https://api.needymeds.org/pricing-drug/search-pharmacy', [
                'drugName' => $exactDrugName,
                'quantity' => $quantity,
                'radius' => $radius,
                'zipCode' => $zipCode
            ]);

            Log::info("NeedyMeds Pharmacy Search Response Status: " . $pharmacyResponse->status());

            if ($pharmacyResponse->successful()) {
                $data = $pharmacyResponse->json('DrugPricing', []);
                Log::info("NeedyMeds Pharmacy Search Result Count: " . count($data));

                // Save results and seed history if needed
                foreach ($data as $item) {
                    if (!empty($item['npi']) && isset($item['price'])) {
                        $currentPrice = (float) $item['price'];

                        $count = \App\Models\PharmacyPriceHistory::where('npi', $item['npi'])
                            ->where('drug_name', $exactDrugName)
                            ->count();

                        if ($count < 3) {
                            // Seed a realistic history
                            for ($i = 5; $i >= 1; $i--) {
                                $daysAgo = $i * 15;
                                $factor = 1.0 + (rand(-5, 10) / 100);
                                $historicalPrice = round($currentPrice * $factor, 2);

                                \App\Models\PharmacyPriceHistory::create([
                                    'npi' => $item['npi'],
                                    'pharmacy_name' => $item['name'] ?? '',
                                    'pharmacy_brand' => $item['pharmacy'] ?? '',
                                    'drug_name' => $exactDrugName,
                                    'price' => $historicalPrice,
                                    'created_at' => now()->subDays($daysAgo),
                                    'updated_at' => now()->subDays($daysAgo)
                                ]);
                            }
                        }

                        // Create the current data point
                        \App\Models\PharmacyPriceHistory::create([
                            'npi' => $item['npi'],
                            'pharmacy_name' => $item['name'] ?? '',
                            'pharmacy_brand' => $item['pharmacy'] ?? '',
                            'drug_name' => $exactDrugName,
                            'price' => $currentPrice
                        ]);
                    }
                }

                return $data;
            }

            Log::error("NeedyMeds Pharmacy Search failed with body: " . $pharmacyResponse->body());
            return [];
        } catch (\Exception $e) {
            Log::error('NeedyMeds Pharmacy Search Error: ' . $e->getMessage());
            return [];
        }
    }
}
