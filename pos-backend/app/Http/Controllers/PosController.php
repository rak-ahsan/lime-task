<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProcessSaleRequest;
use App\Services\PosService;
use App\Helpers\ApiHelper;

class PosController extends Controller
{
    protected $posService;

    public function __construct(PosService $posService)
    {
        $this->posService = $posService;
    }

    public function processSale(ProcessSaleRequest $request)
    {
        try {
            $result = $this->posService->processSale(
                $request->validated()['items']
            );

            return ApiHelper::success([
                'sale'           => $result['sale'],
                'updated_stock'  => $result['updated_products'],
            ], 'Sale processed successfully', 200);

        } catch (\Throwable $e) {
            return ApiHelper::error(
                'Sale processing failed',
                $e->getMessage(),
                400
            );
        }
    }
}
