<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validataion = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed'
        ]);
        $register =  User::create($validataion);

        $token = $register->createToken($request->name);
        return response()->json([
            'register' => $register,
            'token' => $token->plainTextToken,
            'message' => 'Register Successful'
        ]);
    }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => "The provided credentials are incorrect"
            ], 401);
        }

        $token = $user->createToken('authToken');

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
            'message' => 'Login Successful'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'message' => 'You are logged out.'
        ]);
    }
}
