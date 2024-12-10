<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    // Fetch User List and Roles
    public function getList()
    {
        try {
            $users = DB::table('users as u')
                ->join('roles as r', 'u.role_id', '=', 'r.id')
                ->select('u.id', 'u.name', 'u.username', 'u.created_by', 'u.is_active', 'r.name as role_name')
                ->get();

            $roles = DB::table('roles')
                ->select('id as value', 'name as label')
                ->get();

            return response()->json([
                'list' => $users,
                'role' => $roles,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch data.'], 500);
        }
    }

    // Register User
    public function register(Request $request)
    {
        $validated = $request->validate([
            // 'role_id' => 'required|exists:roles,id',
            'name' => 'required|max:255',
            'email' => 'required|unique:users',
            'password' => 'required|min:3',
            // 'is_active' => 'required|boolean',
        ]);

        try {
            $validated['password'] = Hash::make($request->password);
            // $validated['created_by'] = $request->user()->name ?? 'system';

            $user = User::create($validated);

            return response()->json([
                'message' => 'New account created successfully!',
                'data' => $user,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to register user.'], 500);
        }
    }

    // Login User
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'error' => 'Invalid email or password.',
            ], 401);
        }

        $token = $user->createToken('authToken');

        return response()->json([
            'message' => 'Login successful',
            'profile' => $user,
            'permissions' => ['view_all', 'delete', 'edit'],
            'access_token' => $token->plainTextToken,
        ]);
    }

    // Get Profile
    public function profile(Request $request)
    {
        return response()->json([
            'profile' => $request->user(),
        ]);
    }

    // Validate Token Middleware
    public function validateToken()
    {
        return function ($request, $next) {
            $authorization = $request->header('Authorization');
            $tokenFromClient = $authorization ? explode(' ', $authorization)[1] : null;

            if (!$tokenFromClient) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $token = PersonalAccessToken::findToken($tokenFromClient);

            if (!$token || !$token->tokenable) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $request->merge([
                'current_id' => $token->tokenable->id,
                'auth' => $token->tokenable,
                'permissions' => ['view_all', 'delete', 'edit'],
            ]);

            return $next($request);
        };
    }
}
