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

            // validate stock

            if ($product->stock < $qty) {
                throw new \Exception("Not enough stock for product {$product->name}");
            }

            // base price
            $originalPrice = $product->price * $qty;

            $discountAmount = 0;
            $tradeOfferValue = 0;
            $freeQuantity = 0;

            // discount
            $discountActive =
                $product->discount &&
                $now->between(
                    $product->discount_or_trade_offer_start_date,
                    $product->discount_or_trade_offer_end_date
                );

            if ($discountActive) {
                $discountAmount = ($originalPrice * $product->discount) / 100;
            }

            // trade offer (buy x get y free)
            $tradeOfferActive =
                $product->trade_offer_min_qty &&
                $now->between(
                    $product->discount_or_trade_offer_start_date,
                    $product->discount_or_trade_offer_end_date
                );

            if ($tradeOfferActive && $qty >= $product->trade_offer_min_qty) {
                $eligibleTimes = floor($qty / $product->trade_offer_min_qty);
                $freeQuantity = $eligibleTimes * $product->trade_offer_get_qty;

                // free qty price reduction
                $tradeOfferValue = $freeQuantity * $product->price;
            }

            // final price
            $finalPrice = $originalPrice - $discountAmount - $tradeOfferValue;

            $totalQtyUsed = $qty + $freeQuantity;

            $newStock = $product->stock - $totalQtyUsed;

            if ($newStock < 5) {
                //send push notification or notification or sms logic can be added here
                throw new \Exception("Selling this quantity will break min stock for {$product->name}");
            }

            // update stock
            $this->productRepository->update($product, ['stock' => $newStock]);

            // build sale line item
            $saleItems[] = [
                'product_id' => $product->id,
                'quantity' => $qty,
                'free_quantity' => $freeQuantity,
                'original_price' => $originalPrice,
                'discount_amount' => $discountAmount,
                'trade_offer_value' => $tradeOfferValue,
                'final_price' => $finalPrice,
            ];

            $updatedProducts[] = [
                'product_id' => $product->id,
                'updated_stock' => $newStock,
            ];

            $totalOriginal += $originalPrice;
            $totalDiscount += $discountAmount;
            $totalTradeOfferValue += $tradeOfferValue;
            $totalFinal += $finalPrice;
        }

        // create sale
        $sale = $this->saleRepository->create([
            'user_id' => Auth::id(),
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
