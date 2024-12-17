<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EmployeesController;
use App\Http\Controllers\ProductController;

Route::prefix('v1')->middleware(['validateToken'])->group(function () {
    Route::post('/profile', [AuthController::class, 'profile']);
    Route::get('/user', [AuthController::class, 'getUserAll']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('/employees', EmployeesController::class);
    Route::apiResource('/category', CategoryController::class);
    Route::apiResource('/product', ProductController::class);
});

Route::post('/v1/login', [AuthController::class, 'login']);
Route::post('/v1/register', [AuthController::class, 'register']);



