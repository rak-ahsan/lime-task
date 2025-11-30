<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = $this->productService->getAllProducts();
        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
            'trade_offer_min_qty' => 'nullable|integer|min:0',
            'trade_offer_get_qty' => 'nullable|integer|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'discount_or_trade_offer_start_date' => 'nullable|date',
            'discount_or_trade_offer_end_date' => 'nullable|date|after_or_equal:discount_or_trade_offer_start_date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Business rule: A product can have either a percentage discount OR a trade offer (Buy X Get Y), not both at the same time.
        if ($request->has('discount') && ($request->has('trade_offer_min_qty') || $request->has('trade_offer_get_qty'))) {
            return response()->json(['message' => 'A product cannot have both a discount and a trade offer.'], 422);
        }

        $product = $this->productService->createProduct($request->all());
        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Not required for this prompt
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'min_stock' => 'nullable|integer|min:0',
            'trade_offer_min_qty' => 'nullable|integer|min:0',
            'trade_offer_get_qty' => 'nullable|integer|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'discount_or_trade_offer_start_date' => 'nullable|date',
            'discount_or_trade_offer_end_date' => 'nullable|date|after_or_equal:discount_or_trade_offer_start_date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Business rule: A product can have either a percentage discount OR a trade offer (Buy X Get Y), not both at the same time.
        if ($request->has('discount') && ($request->has('trade_offer_min_qty') || $request->has('trade_offer_get_qty'))) {
            return response()->json(['message' => 'A product cannot have both a discount and a trade offer.'], 422);
        }

        $product = $this->productService->updateProduct($id, $request->all());
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Not required for this prompt
    }
}
