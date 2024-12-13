<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeesController;


Route::prefix('v1')->middleware(['validateToken'])->group(function () {
    Route::post('/profile', [AuthController::class, 'profile']); // Get profile
    Route::get('/user', [AuthController::class, 'getUserAll']); // Get all user
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/logout', [AuthController::class, 'logout']);


    //employees
    Route::apiResource('/employees', EmployeesController::class);
});


Route::post('/v1/login', [AuthController::class, 'login']);
Route::post('/v1/register', [AuthController::class, 'register']);


