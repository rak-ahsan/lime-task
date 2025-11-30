<?php

namespace App\Services;

use App\Repositories\ProductRepository;
use App\Repositories\SaleRepository;
use Illuminate\Support\Facades\Auth;

class PosService
{
    protected $productRepository;
    protected $saleRepository;

    public function __construct(ProductRepository $productRepository, SaleRepository $saleRepository)
    {
        $this->productRepository = $productRepository;
        $this->saleRepository = $saleRepository;
    }

    public function processSale(array $items)
    {
        $totalOriginalPrice = 0;
        $totalDiscountAmount = 0;
        $totalFinalPrice = 0;
        $saleItems = [];
        $updatedProducts = [];

        foreach ($items as $item) {
            $product = $this->productRepository->find($item['product_id']);

            if ($product->stock < $item['quantity']) {
                throw new \Exception('Not enough stock for product ' . $product->name);
            }

            $originalPrice = $product->price * $item['quantity'];
            $discountAmount = 0;
            $freeQuantity = 0;

            $now = now();
            if ($product->discount && $now->between($product->discount_or_trade_offer_start_date, $product->discount_or_trade_offer_end_date)) {
                $discountAmount = ($originalPrice * $product->discount) / 100;
            } elseif ($product->trade_offer_min_qty && $item['quantity'] >= $product->trade_offer_min_qty && $now->between($product->discount_or_trade_offer_start_date, $product->discount_or_trade_offer_end_date)) {
                $freeQuantity = floor($item['quantity'] / $product->trade_offer_min_qty) * $product->trade_offer_get_qty;
            }

            $finalPrice = $originalPrice - $discountAmount;

            $totalOriginalPrice += $originalPrice;
            $totalDiscountAmount += $discountAmount;
            $totalFinalPrice += $finalPrice;

            $product->stock -= $item['quantity'];
            $this->productRepository->update($product, ['stock' => $product->stock]);

            $saleItems[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'original_price' => $originalPrice,
                'discount_amount' => $discountAmount,
                'final_price' => $finalPrice,
                'free_quantity' => $freeQuantity,
            ];

            $updatedProducts[] = [
                'product_id' => $product->id,
                'updated_stock' => $product->stock,
            ];
        }

        $sale = $this->saleRepository->create([
            // 'user_id' => Auth::id(),
            'user_id' => 1,
            'total_original_price' => $totalOriginalPrice,
            'total_discount_amount' => $totalDiscountAmount,
            'total_final_price' => $totalFinalPrice,
        ], $saleItems);

        return [
            'sale' => $sale,
            'updated_products' => $updatedProducts,
        ];
    }
}
