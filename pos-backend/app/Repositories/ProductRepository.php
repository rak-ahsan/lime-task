<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository
{
    public function getAll($request)
    {
        $query = Product::query();
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'LIKE', "%{$search}%");
        }
        if ($request->filled('sort_by')) {
            $sortBy = $request->sort_by;
            $sortDir = $request->sort_dir ?? 'asc';
            if (in_array($sortBy, ['name', 'price', 'stock', 'created_at'])) {
                $query->orderBy($sortBy, $sortDir);
            }
        } else {
            $query->orderBy('id', 'desc');
        }

        $perPage = $request->per_page ?? 10;

        return $query->paginate($perPage);
    }

    public function find($id)
    {
        return Product::find($id);
    }

    public function create(array $data)
    {
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {

            $filename = time() . '_' . uniqid() . '.' . $data['image']->getClientOriginalExtension();

            $data['image']->move(public_path('products'), $filename);

            $data['image'] = 'products/' . $filename;
        }
        return Product::create($data);
    }


    public function update(Product $product, array $data)
    {
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            if ($product->image && file_exists(public_path($product->image))) {
                @unlink(public_path($product->image));
            }
            $filename = time() . '_' . uniqid() . '.' . $data['image']->getClientOriginalExtension();
            $data['image']->move(public_path('products'), $filename);
            $data['image'] = 'products/' . $filename;
        }
        $product->update($data);
        return $product;
    }


    public function delete(Product $product)
    {
        return $product->delete();
    }
}
