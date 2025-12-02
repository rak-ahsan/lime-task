<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PosController;

Route::prefix('v1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('auth/me', function (Request $request) {
            return $request->user();
        });

        Route::prefix('products')->group(function () {
            Route::get('/',       [ProductController::class, 'index']);
            Route::post('/',      [ProductController::class, 'store']);
            Route::put('{id}',    [ProductController::class, 'update']);
        });

        Route::post('pos/sale', [PosController::class, 'processSale']);
        Route::post('auth/logout', [AuthController::class, 'logout']);
    });
});
