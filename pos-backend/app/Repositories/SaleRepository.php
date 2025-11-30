<?php

namespace App\Repositories;

use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;

class SaleRepository
{
    public function create(array $data, array $items)
    {
        return DB::transaction(function () use ($data, $items) {
            $sale = Sale::create($data);

            foreach ($items as $item) {
                $sale->items()->create($item);
            }

            return $sale;
        });
    }
}
