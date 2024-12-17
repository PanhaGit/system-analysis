<?php
namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $getAll = Product::all();
        return response()->json([
            'getAll' => $getAll
        ]);
    }

    public function store(ProductRequest $request)
    {
        $validated = $request->validated();

        if (Auth::check()) {
            $validated['create_by'] = Auth::user()->name;
        } else {
            return response()->json([
                'message' => 'User not authenticated.',
            ], 401);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'laravel_api_image');
            $validated['image'] = $imagePath;
        }

        // Create the product
        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully!',
            'product' => $product,
        ], 201);
    }

    public function update(ProductRequest $request, $id)
    {
        $validated = $request->validated();

        // Find the product by ID or fail if not found
        $product = Product::findOrFail($id);

        // Handle new image upload
        if ($request->hasFile('image')) {
            // If the product already has an image, remove the old image
            if ($product->image) {
                $this->removeOldImage($product->image);
            }

            // Store the new image
            $imagePath = $request->file('image')->store('products', 'laravel_api_image');
            $validated['image'] = $imagePath;
        }

        // Handle image removal
        if ($request->has('image_remove') && $request->image_remove == 1) {
            // If image_remove is 1, remove the current image
            if ($product->image) {
                $this->removeOldImage($product->image);
            }
            $validated['image'] = null; // Set image to null to remove it from the database
        }

        // Update the product with the validated data
        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully!',
            'product' => $product,
        ], 200);
    }

    /**
     * Remove the old image from the storage.
     *
     * @param string $imagePath
     * @return void
     */
    private function removeOldImage($imagePath)
    {
        $imagePath = storage_path('products' . $imagePath);
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Remove the image if exists before deleting the product
        if ($product->image) {
            $this->removeOldImage($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully!',
        ], 200);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);

        return response()->json([
            'product' => $product,
        ], 200);
    }
}
