<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'price',
        'stock',
        'min_stock',
        'trade_offer_min_qty',
        'trade_offer_get_qty',
        'discount',
        'image',
        'discount_or_trade_offer_start_date',
        'discount_or_trade_offer_end_date',
    ];

    public function getImageAttribute($value)
    {
        return $value ? asset($value) : null;
    }
}
