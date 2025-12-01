<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Helpers\ApiHelper;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => 'sometimes|required|string|max:255',
            'price'       => 'sometimes|required|numeric|min:0',
            'stock'       => 'sometimes|required|integer|min:0',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'trade_offer_min_qty' => 'nullable|integer|min:0',
            'trade_offer_get_qty' => 'nullable|integer|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'discount_or_trade_offer_start_date' => 'nullable|date',
            'discount_or_trade_offer_end_date'   => 'nullable|date|after_or_equal:discount_or_trade_offer_start_date',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {

            if (
                $this->filled('discount') &&
                ($this->filled('trade_offer_min_qty') || $this->filled('trade_offer_get_qty'))
            ) {
                $validator->errors()->add(
                    'discount',
                    'A product cannot have both a discount and a trade offer.'
                );
            }
        });
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            ApiHelper::validation($validator->errors())
        );
    }
}
