<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 8, 2);
            $table->integer('stock');
            $table->integer('min_stock')->optional();
            $table->integer('trade_offer_min_qty')->nullable();
            $table->integer('trade_offer_get_qty')->nullable();
            $table->decimal('discount', 5, 2)->nullable();
            $table->dateTime('discount_or_trade_offer_start_date')->nullable();
            $table->dateTime('discount_or_trade_offer_end_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
