<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\MedecinController;
use App\Http\Controllers\InfirmierController;
use App\Http\Controllers\RendezVousController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// Route de test pour vérifier la connexion API (publique)
Route::get('/check-connection', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'La connexion à l\'API Laravel fonctionne correctement',
        'time' => now()->toDateTimeString(),
    ]);
});

// Routes d'authentification (publiques)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Routes protégées (nécessitent authentification)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // Routes pour les patients (accessibles par tous les utilisateurs authentifiés)
    Route::apiResource('patients', PatientController::class);
    
    // Routes pour les médecins (accessibles par admins et médecins)
    Route::middleware('role:admin,medecin')->group(function () {
        Route::apiResource('medecins', MedecinController::class);
    });
    
    // Routes pour les infirmiers (accessibles par admins et infirmiers)
    Route::middleware('role:admin,infirmier')->group(function () {
        Route::apiResource('infirmiers', InfirmierController::class);
    });
    
    // Routes pour les rendez-vous (accessibles par tous les utilisateurs authentifiés)
    Route::apiResource('rendez-vous', RendezVousController::class);
    
    // Routes pour les tableaux de bord
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats'])
         ->middleware('role:admin');
});