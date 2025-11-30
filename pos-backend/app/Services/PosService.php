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
        $saleItems = [];
        $updatedProducts = [];

        $totalOriginal = 0;
        $totalDiscount = 0;
        $totalTradeOfferValue = 0;
        $totalFinal = 0;

        $now = now();

        foreach ($items as $item) {
            $product = $this->productRepository->find($item['product_id']);
            $qty = $item['quantity'];

            if (!$product) {
                throw new \Exception('Product not found.');
            }

            // Check available stock
            if ($product->stock < $qty) {
                throw new \Exception("Not enough stock for product {$product->name}");
            }

            $originalPrice = $product->price * $qty;
            $discountAmount = 0;
            $tradeOfferValue = 0;
            $freeQuantity = 0;

            // ---- 1) Apply Discount (if active) ------------------------------------
            $discountActive =
                $product->discount &&
                $now->between($product->discount_or_trade_offer_start_date, $product->discount_or_trade_offer_end_date);

            if ($discountActive) {
                $discountAmount = ($originalPrice * $product->discount) / 100;
            }

            // ---- 2) Apply Trade Offer (Buy X Get Y Free) -------------------------
            $tradeOfferActive =
                $product->trade_offer_min_qty &&
                $now->between($product->discount_or_trade_offer_start_date, $product->discount_or_trade_offer_end_date);

            if ($tradeOfferActive && $qty >= $product->trade_offer_min_qty) {
                $eligibleTimes = floor($qty / $product->trade_offer_min_qty);
                $freeQuantity = $eligibleTimes * $product->trade_offer_get_qty;

                // Free qty reduces price equivalent
                $tradeOfferValue = $freeQuantity * $product->price;
            }

            // Prevent both double counting
            $finalPrice = $originalPrice - $discountAmount - $tradeOfferValue;

            // ---- 3) STOCK VALIDATION WITH MIN STOCK ------------------------------
            $newStock = $product->stock - $qty;

            if ($newStock < $product->min_stock) {
                throw new \Exception("Selling this quantity will break min stock for {$product->name}");
            }

            // Update stock
            $this->productRepository->update($product, ['stock' => $newStock]);

            // ---- 4) Prepare data for sale record --------------------------------
            $saleItems[] = [
                'product_id' => $product->id,
                'quantity' => $qty,
                'original_price' => $originalPrice,
                'discount_amount' => $discountAmount,
                'trade_offer_value' => $tradeOfferValue,
                'final_price' => $finalPrice,
                'free_quantity' => $freeQuantity,
            ];

            $updatedProducts[] = [
                'product_id' => $product->id,
                'updated_stock' => $newStock
            ];

            // Accumulate totals
            $totalOriginal += $originalPrice;
            $totalDiscount += $discountAmount;
            $totalTradeOfferValue += $tradeOfferValue;
            $totalFinal += $finalPrice;
        }

        // Save sale (with items)
        $sale = $this->saleRepository->create([
            'user_id' => 1,
            'total_original_price' => $totalOriginal,
            'total_discount_amount' => $totalDiscount,
            'total_offer_amount' => $totalTradeOfferValue,
            'total_final_price' => $totalFinal,
        ], $saleItems);

        return [
            'sale' => $sale,
            'updated_products' => $updatedProducts,
        ];
    }
}
