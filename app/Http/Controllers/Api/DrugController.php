<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\NeedyMedsService;
use App\Models\PharmacyPriceHistory;
use Carbon\Carbon;

class DrugController extends Controller
{
    public function search(Request $request, NeedyMedsService $needyMedsService)
    {
        $query = $request->query('q');
        return response()->json($needyMedsService->searchDrugName($query));
    }

    public function pharmacies(Request $request, NeedyMedsService $needyMedsService)
    {
        $exactDrugName = $request->input('drugName');
        $userZip = $request->input('zip_code') ?? (auth('sanctum')->check() ? auth('sanctum')->user()->zip_code : '88595');
        $userRadius = $request->input('radius') ?? (auth('sanctum')->check() ? auth('sanctum')->user()->radius : '42');
        $quantity = $request->input('quantity', '1');

        return response()->json($needyMedsService->getPharmacyPrices($exactDrugName, $userZip, $userRadius, $quantity));
    }

    public function pharmacyHistory(Request $request)
    {
        $npi = $request->query('npi');
        $drugName = $request->query('drugName');

        $history = PharmacyPriceHistory::where('npi', $npi)
            ->where('drug_name', $drugName)
            ->orderBy('created_at', 'asc')
            ->get()
            ->groupBy(function ($item) {
                return $item->created_at->format('Y-m-d');
            })
            ->map(function ($group) {
                $latest = $group->last();
                return [
                    'date' => Carbon::parse($latest->created_at)->format('M d'),
                    'price' => (float) $latest->price,
                    'discount_price' => $latest->discount_price !== null ? (float) $latest->discount_price : round((float) $latest->price * 0.85, 2)
                ];
            })
            ->values();

        return response()->json($history);
    }
}
