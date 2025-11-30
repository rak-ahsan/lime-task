<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'Product A',
                'price' => 100.00,
                'stock' => 100,
                'min_stock' => 10,
                'trade_offer_min_qty' => null,
                'trade_offer_get_qty' => null,
                'discount' => 10.00,
                'discount_or_trade_offer_start_date' => now(),
                'discount_or_trade_offer_end_date' => now()->addDays(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Product B',
                'price' => 200.00,
                'stock' => 50,
                'min_stock' => 5,
                'trade_offer_min_qty' => 2,
                'trade_offer_get_qty' => 1,
                'discount' => null,
                'discount_or_trade_offer_start_date' => now(),
                'discount_or_trade_offer_end_date' => now()->addDays(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Product C',
                'price' => 150.00,
                'stock' => 75,
                'min_stock' => 15,
                'trade_offer_min_qty' => null,
                'trade_offer_get_qty' => null,
                'discount' => null,
                'discount_or_trade_offer_start_date' => null,
                'discount_or_trade_offer_end_date' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
