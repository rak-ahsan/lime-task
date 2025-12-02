"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Product, SaleBreakdownResponse } from "../../../../../types/types";
import { processSaleAction, searchProductsAction } from "./actions";
import ProductSearch from "./ProductSearch";
import CartTable from "./CartTable";
import OrderSummary from "./OrderSummary";
import { useCart } from "@/context/cart-context";
import { useDebounce } from "@/hooks/debounch";
import SaleBreakDown from "./SaleBreakDown";

export default function PosClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const {
    cart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    calculateTotals,
    clearCart,
  } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>(
    initialProducts || []
  );
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [processingSale, setProcessingSale] = useState(false);
  const [saleBreakdown, setSaleBreakdown] =
    useState<SaleBreakdownResponse | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const totals = calculateTotals();

  useEffect(() => {
    const fetch = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setLoadingSearch(true);
        const data = await searchProductsAction(debouncedSearch);
        setSearchResults(data || []);
      } catch (err) {
        console.error("search error", err);
        toast.error("Search failed");
      } finally {
        setLoadingSearch(false);
      }
    };

    fetch();
  }, [debouncedSearch]);

  const handleProductSelect = useCallback(
    (product: Product) => addItemToCart(product),
    [addItemToCart]
  );

  const handleQuantityChange = useCallback(
    (id: string, v: string) => {
      const quantity = parseInt(v, 10);
      if (!isNaN(quantity)) updateItemQuantity(id, quantity);
    },
    [updateItemQuantity]
  );

  const handleRemoveItem = useCallback(
    (id: string) => removeItemFromCart(id),
    [removeItemFromCart]
  );

  const handleProcessSale = async () => {
    if (cart.length === 0) {
      toast.warning("Cart is empty. Add products to process sale.");
      return;
    }

    setProcessingSale(true);

    const saleData = {
      items: cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
      })),
      total_amount: totals.finalTotal,
      total_discount: totals.totalDiscount,
    };

    try {
      const res = await processSaleAction(saleData);
      if (res?.success) {
        toast.success("Sale processed successfully!");
        let breakdown: SaleBreakdownResponse;
        //@ts-ignore
        if (res.breakdown) {
          //@ts-ignore
          breakdown = res.breakdown;
          if (breakdown.total_subtotal === 0 || !breakdown.total_subtotal) {
            breakdown.total_subtotal = breakdown.items.reduce(
              (sum, item) => sum + (item.subtotal || 0),
              0
            );
          }
        } else {
          const items = cart.map((c) => ({
            product_id: c.product.id,
            product_name: c.product.name,
            quantity: c.quantity,
            unit_price: c.product.price || 0,
            subtotal: (c.product.price || 0) * c.quantity,
            discount_amount: 0,
            trade_offer_applied: false,
            trade_offer_text: null,
            net_amount: (c.product.price || 0) * c.quantity,
          }));

          breakdown = {
            items,
            total_subtotal: items.reduce((sum, item) => sum + item.subtotal, 0),
            total_discount: totals.totalDiscount || 0,
            total_trade_offer_deduction: 0,
            final_total: totals.finalTotal || 0,
          };
        }

        setSaleBreakdown(breakdown);
        setShowBreakdown(true);
        clearCart();
      } else {
        //@ts-ignore
        toast.error(res?.message?.errors);
      }
    } catch (err) {
      toast.error("Failed to process sale.");
    } finally {
      setProcessingSale(false);
      setSearchTerm("");
    }
  };

  const handleCloseBreakdown = () => {
    setShowBreakdown(false);
    setSaleBreakdown(null);
  };

  return (
    <>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div className="col-span-1 md:col-span-1">
          <ProductSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchResults={searchResults}
            loadingSearch={loadingSearch}
            onSelectProduct={handleProductSelect}
          />
        </div>

        <div className="col-span-1 md:col-span-1">
          <CartTable onQtyChange={handleQuantityChange} onRemove={handleRemoveItem} />
        </div>

        <div className="col-span-1 md:col-span-1">
          <OrderSummary
            totals={totals}
            processingSale={processingSale}
            onProcessSale={handleProcessSale}
            onClearCart={clearCart}
          />
        </div>
      </div>

      <SaleBreakDown
        breakdown={saleBreakdown}
        open={showBreakdown}
        onClose={handleCloseBreakdown}
      />
    </>
  );
}