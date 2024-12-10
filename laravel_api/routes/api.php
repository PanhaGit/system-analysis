<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/v1/user', function (Request $request) {
        return $request->user();
    });
    Route::apiResource('post', PostController::class);
});


Route::get('/v1', function () {
    return response()->json([
        'message' => "API"
    ]);
});


Route::post('/v1/register', [AuthController::class, 'register']);
Route::post('/v1/login', [AuthController::class, 'login']);
Route::post('/v1/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
