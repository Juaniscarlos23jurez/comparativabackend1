<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PriceAlarm;

class AlarmController extends Controller
{
    public function index()
    {
        return response()->json(PriceAlarm::where('user_id', auth()->id())->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'medication_name' => 'required|string',
            'last_price' => 'nullable|numeric'
        ]);

        $alarm = PriceAlarm::updateOrCreate([
            'user_id' => auth()->id(),
            'medication_name' => $request->input('medication_name')
        ], [
            'last_price' => $request->input('last_price')
        ]);

        return response()->json($alarm, 200);
    }

    public function destroy($id)
    {
        $alarm = PriceAlarm::where('user_id', auth()->id())->where('id', $id)->first();
        if ($alarm) {
            $alarm->delete();
            return response()->json(['success' => true]);
        }
        return response()->json(['error' => 'Not found'], 404);
    }
}
