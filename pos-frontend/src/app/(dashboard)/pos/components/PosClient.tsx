"use client";

import { useCart } from "@/context/cart-context";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Product } from "../../../../../types/types";
import { processSaleAction, searchProductsAction } from "./actions";
import ProductSearch from "./ProductSearch";
import CartTable from "./CartTable";
import OrderSummary from "./OrderSummary";


function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function PosClient({ initialProducts }: { initialProducts: Product[] }) {
  const {
    cart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    calculateTotals,
    clearCart,
  } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>(initialProducts);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [processingSale, setProcessingSale] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const totals = calculateTotals();

  useEffect(() => {
    const fetch = async () => {
      if (debouncedSearch.length < 2) {
        setSearchResults([]);
        return;
      }

      setLoadingSearch(true);
      const data = await searchProductsAction(debouncedSearch);
      setSearchResults(data);
      setLoadingSearch(false);
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

    const res = await processSaleAction(saleData);

    if (res.success) {
      toast.success("Sale processed successfully!");
      clearCart();
    } else {
      toast.error("Failed to process sale.");
    }

    setProcessingSale(false);
    setSearchTerm("");

  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
      <ProductSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchResults={searchResults}
        loadingSearch={loadingSearch}
        onSelectProduct={handleProductSelect}
      />

      <CartTable
        onQtyChange={handleQuantityChange}
        onRemove={handleRemoveItem}
      />

      <OrderSummary
        totals={totals}
        processingSale={processingSale}
        onProcessSale={handleProcessSale}
        onClearCart={clearCart}
      />
    </div>
  );
}
