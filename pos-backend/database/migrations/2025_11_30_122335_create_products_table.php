<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->integer('stock');
            $table->integer('min_stock')->nullable();
            $table->integer('trade_offer_min_qty')->nullable();
            $table->integer('trade_offer_get_qty')->nullable();
            $table->decimal('discount', 5, 2)->nullable();
            $table->dateTime('discount_or_trade_offer_start_date')->nullable();
            $table->dateTime('discount_or_trade_offer_end_date')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};

