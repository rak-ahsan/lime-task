<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'stock',
        'min_stock',
        'trade_offer_min_qty',
        'trade_offer_get_qty',
        'discount',
        'discount_or_trade_offer_start_date',
        'discount_or_trade_offer_end_date',
    ];
}
