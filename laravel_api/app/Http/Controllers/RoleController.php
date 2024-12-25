<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleResuest;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    public function index()
    {
        try {
            $getAll = Role::all();

            return response()->json([
                'getAll' => $getAll
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve customers.',
                Log::error('Failed to retrieve roles: ' . $e->getMessage(), [
                    'exception' => $e
                ])
            ], 500);
        }
    }

    public function store(RoleResuest $roleRequest)
    {
        try {
            $newCode = $this->newRoleCode();

            if (!$newCode) {
                return response()->json([
                    'message' => 'Failed to generate role code.',
                ], 500);
            }

            // Validate the rest of the request data
            $validated = $roleRequest->validated();
            $validated['code'] = $newCode;
            $validated['create_by'] = Auth::user()->name;

            $create = Role::create($validated);

            return response()->json([
                'message' => 'Role created successfully.',
                'data' => $create
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create role: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json([
                'message' => 'Failed to create role.'
            ], 500);
        }
    }



    public function update(RoleResuest $roleResuest, $id)
    {
        try {
            $validated = $roleResuest->validated();
            $role = Role::find($id);

            if (!$role) {
                return response()->json([
                    'message' => 'Role not found'
                ], 404);
            }
            $role->update($validated);

            return response()->json([
                'message' => 'Role updated successfully',
                'role' => $role
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve customers.',
                Log::error('Failed to retrieve roles: ' . $e->getMessage(), [
                    'exception' => $e
                ])
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                return response()->json([
                    'message' => 'Role not found'
                ], 404);
            }


            $role->delete();

            return response()->json([
                'message' => 'Role deleted successfully.',
                'data' => $role
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve customers.',
                Log::error('Failed to retrieve roles: ' . $e->getMessage(), [
                    'exception' => $e
                ])
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $role = Role::find($id);

            if ($role) {
                return response()->json([
                    'message' => 'Role not found'
                ], 404);
            }

            return response()->json([
                'message' => 'Customer retrieved successfully.',
                'getOne' => $role
            ], 200);


        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve customers.',
                Log::error('Failed to retrieve roles: ' . $e->getMessage(), [
                    'exception' => $e
                ])
            ], 500);
        }
    }

    protected function newRoleCode()
    {
        try {
            // Get the highest numeric value from the role codes, excluding the 'CH247-' prefix
            $latestRole = Role::selectRaw('MAX(CAST(SUBSTRING(code, 7) AS UNSIGNED)) as max_code')->first();

            // Determine the next code number
            $nextCodeNumber = $latestRole->max_code ? $latestRole->max_code + 1 : 1;

            // Generate the new role code
            $newCode = 'CH247-' . str_pad($nextCodeNumber, 3, '0', STR_PAD_LEFT); // Pad with zeros to make it 3 digits

            return $newCode;
        } catch (\Exception $e) {
            Log::error('Failed to generate role code: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return null;
        }
    }



}
