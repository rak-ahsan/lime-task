<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition()
    {
        $categories = [
            'milk', 'tea', 'cookies', 'oil', 'rice', 'drink', 'soap', 'tissue',
            'shampoo', 'bulb', 'chocolates', 'biscuits', 'toothpaste', 'cheese',
            'yogurt', 'coffee', 'cereal', 'sauce', 'pasta', 'flour'
        ];

        $baseName = ucfirst($this->faker->randomElement($categories))
            . ' ' . $this->faker->randomElement(['500g', '1L', '250g', 'Pack', 'Box', 'Bottle', '500ml', '2L', '400ml', '5kg']);

        $price = $this->faker->randomFloat(2, 20, 5000);
        $stock = $this->faker->numberBetween(0, 500);

        $roll = $this->faker->numberBetween(1, 100);
        $now = Carbon::now();

        if ($roll <= 25) {
            $trade_offer_min_qty = $this->faker->numberBetween(2, 6);
            $trade_offer_get_qty = $this->faker->numberBetween(1, min(2, $trade_offer_min_qty - 1));
            $discount = null;

            $start = $now->copy()->subDays($this->faker->numberBetween(0, 2));
            $end = $start->copy()->addDays($this->faker->numberBetween(3, 20));
        } elseif ($roll <= 60) {
            $trade_offer_min_qty = null;
            $trade_offer_get_qty = null;

            $discount = $this->faker->randomFloat(2, 5, 35);

            $start = $now->copy()->subDays($this->faker->numberBetween(0, 2));
            $end = $start->copy()->addDays($this->faker->numberBetween(3, 14));
        } else {
            $trade_offer_min_qty = null;
            $trade_offer_get_qty = null;
            $discount = null;
            $start = null;
            $end = null;
        }
        $seed = md5($baseName . rand(1, 999999));
        $image = "https://picsum.photos/seed/{$seed}/800/600";

        return [
            'name' => $baseName,
            'price' => $price,
            'stock' => $stock,
            'trade_offer_min_qty' => $trade_offer_min_qty,
            'trade_offer_get_qty' => $trade_offer_get_qty,
            'discount' => $discount,
            'discount_or_trade_offer_start_date' => $start,
            'discount_or_trade_offer_end_date' => $end,
            'image' => $image,
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }
}
