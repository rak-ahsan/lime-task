<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use App\Helpers\ApiHelper;
use Exception;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        try {
            $user = $this->authService->register($request->validated());

            return ApiHelper::success($user, 'User registered successfully', 201);

        } catch (Exception $e) {
            Log::error('Register error: ' . $e->getMessage());
            return ApiHelper::error('Registration failed', null, 500);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $token = $this->authService->login($request->validated());

            if (!$token) {
                return ApiHelper::error('Invalid credentials', null, 401);
            }

            return ApiHelper::success([
                'token' => $token
            ], 'Login successful', 200);

        } catch (Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return ApiHelper::error('Something went wrong during login', null, 500);
        }
    }

    public function logout()
    {
        $this->authService->logout();

        return ApiHelper::success(null, 'Logout successful', 200);
    }
}
