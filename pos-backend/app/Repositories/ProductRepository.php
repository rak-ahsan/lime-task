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
        return Product::create($data);
    }

    public function update(Product $product, array $data)
    {
        $product->update($data);
        return $product;
    }

    public function delete(Product $product)
    {
        return $product->delete();
    }
}
