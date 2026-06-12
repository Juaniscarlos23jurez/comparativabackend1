<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class SavingsController extends Controller
{
    public function pdf(Request $request)
    {
        $data = $request->validate([
            'medications' => 'required|array',
            'options' => 'required|array',
            'options.individual' => 'required|array',
            'options.conveniencia' => 'required|array',
            'options.split' => 'required|array',
        ]);

        $pdf = Pdf::loadView('pdf.savings_report', [
            'medications' => $data['medications'],
            'options' => $data['options'],
            'user' => auth()->user(),
        ]);

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf');
    }
}
