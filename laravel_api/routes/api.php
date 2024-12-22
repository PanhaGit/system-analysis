<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployeesController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;

Route::prefix('v1')->middleware(['validateToken'])->group(function () {
    // Authenticated routes
    Route::post('/profile', [AuthController::class, 'profile']);
    Route::get('/user', [AuthController::class, 'getUserAll']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('/employees', EmployeesController::class);
    Route::apiResource('/category', CategoryController::class);
    Route::apiResource('/product', ProductController::class);
    Route::apiResource('/customer', CustomerController::class);
    Route::apiResource('/role', RoleController::class);
    Route::apiResource('/payments', PaymentMethodController::class);
    Route::apiResource('/order', OrderController::class);
});

// public routes
Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});
