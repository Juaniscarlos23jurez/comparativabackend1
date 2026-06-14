<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DrugController;
use App\Http\Controllers\Api\AlarmController;
use App\Http\Controllers\Api\OptimizerController;
use App\Http\Controllers\Api\SavingsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OnboardingController;

use App\Http\Controllers\Api\NeedyMedsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth API routes
Route::post('/auth/social-login', [AuthController::class, 'socialLogin']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public API routes
Route::get('/drugs/search', [DrugController::class, 'search']);
Route::post('/drugs/pharmacies', [DrugController::class, 'pharmacies']);
Route::get('/drugs/pharmacy-history', [DrugController::class, 'pharmacyHistory']);

Route::post('/programs', [NeedyMedsController::class, 'programs']);
Route::post('/coupons', [NeedyMedsController::class, 'coupons']);
Route::post('/diagnoses', [NeedyMedsController::class, 'diagnoses']);
Route::post('/clinics', [NeedyMedsController::class, 'clinics']);

// Protected API routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::delete('/user', [AuthController::class, 'deleteAccount']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/onboarding', [OnboardingController::class, 'store']);

    Route::get('/alarms', [AlarmController::class, 'index']);
    Route::post('/alarms', [AlarmController::class, 'store']);
    Route::delete('/alarms/{id}', [AlarmController::class, 'destroy']);

    Route::post('/optimizer/calculate', [OptimizerController::class, 'calculate']);
    Route::post('/savings/pdf', [SavingsController::class, 'pdf']);
});
