<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DrugController;
use App\Http\Controllers\Api\AlarmController;
use App\Http\Controllers\Api\OptimizerController;
use App\Http\Controllers\Api\SavingsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OnboardingController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth API routes
Route::post('/auth/social-login', [AuthController::class, 'socialLogin']);

// Public API routes
Route::get('/drugs/search', [DrugController::class, 'search']);
Route::post('/drugs/pharmacies', [DrugController::class, 'pharmacies']);
Route::get('/drugs/pharmacy-history', [DrugController::class, 'pharmacyHistory']);

// Protected API routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/onboarding', [OnboardingController::class, 'store']);

    Route::get('/alarms', [AlarmController::class, 'index']);
    Route::post('/alarms', [AlarmController::class, 'store']);
    Route::delete('/alarms/{id}', [AlarmController::class, 'destroy']);

    Route::post('/optimizer/calculate', [OptimizerController::class, 'calculate']);
    Route::post('/savings/pdf', [SavingsController::class, 'pdf']);
});
