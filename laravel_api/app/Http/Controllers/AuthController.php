<?php
namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{

    public function getUserAll()
    {
        $getUserAll = User::all();

        return response()->json([
            'Get User All' => $getUserAll
        ]);
    }
    public function register(UserRequest $request)
    {
        $validated = $request->validated();

        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),

            ]);
            $token = auth('api')->login($user);
            $access_token = $this->respondWithToken($token);

            return response()->json([
                'user' => $user,
                'message' => 'Account created successfully.',
                'token' => $access_token->original['access_token']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Registration failed. ' . $e->getMessage()
            ], 500);
        }
    }



    public function login()
    {

        $credentials = request(['email', 'password']);


        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Generate the access token
        $access_token = $this->respondWithToken($token);

        return response()->json([
            'user' => auth('api')->user(),
            'message' => 'Login successful.',
            'token' => $access_token->original['access_token']
        ]);
    }


    public function profile()
    {
        return response()->json(auth('api')->user());
    }

    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }


    public function refresh()
    {
        return $this->respondWithToken(JWTAuth::refresh());
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }
}

