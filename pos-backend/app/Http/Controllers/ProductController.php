<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request)
    {
        $products = $this->productService->getAllProducts($request);

        return ApiHelper::success(
            $products,
            'Product list fetched successfully',
            200
        );
    }

    public function store(StoreProductRequest $request)
    {
        try {
            $product = $this->productService->createProduct($request->validated());

            return ApiHelper::success(
                $product,
                'Product created successfully',
                201
            );
        } catch (\Throwable $e) {
            return ApiHelper::error(
                'Failed to create product',
                $e->getMessage(),
                400
            );
        }
    }

    public function update(UpdateProductRequest $request, string $id)
    {
        try {
            $product = $this->productService->updateProduct($id, $request->validated());

            return ApiHelper::success(
                $product,
                'Product updated successfully',
                200
            );
        } catch (\Throwable $e) {
            return ApiHelper::error(
                'Failed to update product',
                $e->getMessage(),
                400
            );
        }
    }
}
