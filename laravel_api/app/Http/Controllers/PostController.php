<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller implements HasMiddleware
{

    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }

    public function index()
    {
        return response()->json([
            "getAll" => Post::all()
        ]);
    }

    //create same node js use medthod POST
    public function store(Request $request)
    {
        $fields = $request->validate([
            'title' => 'required|max:255',
            'body' => 'required'
        ]);

        $data = $request->user()->post()->create($fields);

        return response()->json([
            'data' => [
                "data" => $data,
                'mesage' => "Created"
            ]
        ]);
    }

    // get one by id
    public function show(Post $post)
    {

        return response()->json([
            "data" => $post,
            'mesage' => "Created"
        ]);
    }

    public function update(Request $request, Post $post)
    {

        Gate::authorize('modify', $post);

        $fields = $request->validate([
            'title' => 'required|max:255',
            'body' => 'required'
        ]);

        $post->update($fields);

        return response()->json([

            "data" => $post,
            'message' => "Updated"

        ]);
    }



    public function destroy(Post $post)
    {
        Gate::authorize('modify', $post);
        $post->delete();

        return response()->json([
            'data' => $post,
            'mesage' => 'Deleted'
        ]);
    }
}
