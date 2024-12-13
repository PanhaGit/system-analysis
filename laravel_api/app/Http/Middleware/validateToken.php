<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class validateToken
{
    public function handle(Request $request, Closure $next)
    {
        // Get the Authorization header
        $authorization = $request->header('Authorization');

        // If there's no Authorization header, return Unauthorized
        if (!$authorization) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Extract the token from the header (Authorization: Bearer <token>)
        $token = explode(' ', $authorization)[1] ?? null;

        if (!$token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            // Try to authenticate the user based on the token
            $user = JWTAuth::setToken($token)->toUser(); // Or use parseToken()->authenticate()

            // Attach the user to the request object
            $request->merge(['user' => $user]);

            return $next($request);
        } catch (\Exception $e) {
            // Catch any exceptions (e.g., token expired, invalid)
            return response()->json(['message' => 'Unauthorized: ' . $e->getMessage()], 401);
        }
    }
}


