<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    protected $fillable = [
        'sale_id',
        'product_id',
        'quantity',
        'original_price',
        'discount_amount',
        'final_price',
        'free_quantity',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
