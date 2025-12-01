"use client";

import { useCart } from "@/context/cart-context";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { calculateProductPricing } from "../../../../../lib/pricing";
import { Product } from "../../../../../types/types";
import { processSaleAction, searchProductsAction } from "./actions";

// identical debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function PosClient({ initialProducts }) {
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
    (product: Product) => {
      addItemToCart(product);
    },
    [addItemToCart]
  );

  const handleQuantityChange = useCallback(
    (productId: string, value: string) => {
      const quantity = parseInt(value, 10);
      if (!isNaN(quantity)) updateItemQuantity(productId, quantity);
    },
    [updateItemQuantity]
  );

  const handleRemoveItem = useCallback(
    (productId: string) => {
      removeItemFromCart(productId);
    },
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
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
      {/* Product Search & Selection */}
      <Card className="col-span-full md:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Product Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          {loadingSearch && <p>Loading products...</p>}

          {searchResults.length > 0 && (
            <div className="border rounded-md max-h-60 overflow-y-auto">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="p-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                  onClick={() => handleProductSelect(product)}
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      ${product.price} - Stock: {product.stock}
                    </p>
                  </div>

                  {product.stock <= product.min_stock && (
                    <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                      Low Stock
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {searchTerm.length >= 2 &&
            !loadingSearch &&
            searchResults.length === 0 && (
              <p className="text-sm text-gray-500">No products found.</p>
            )}
        </CardContent>
      </Card>

      {/* POS Table */}
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Current Sale</CardTitle>
        </CardHeader>

        <CardContent>
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">No items in cart.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="w-[100px]">Qty</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {cart.map((item) => {
                  const c = calculateProductPricing(item);

                  return (
                    <TableRow key={item.product.id}>
                      <TableCell className="font-medium">
                        {item.product.name}

                        {c.freeQty > 0 && (
                          <p className="text-xs text-blue-500">
                            Free: {c.freeQty} items (Trade Offer)
                          </p>
                        )}
                      </TableCell>

                      <TableCell>${item.product.price}</TableCell>

                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          min="1"
                          max={item.product.stock}
                          className="w-16 h-8 text-center"
                          onChange={(e) =>
                            handleQuantityChange(
                              item.product.id,
                              e.target.value
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {item.product.discount
                          ? `${item.product.discount}%`
                          : "—"}
                      </TableCell>

                      <TableCell className="font-semibold">
                        ${c.finalPrice.toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleRemoveItem(item.product.id)
                          }
                        >
                          X
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="col-span-full md:col-span-3 lg:col-span-1">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-2">
          <div className="flex justify-between">
            <Label>Subtotal:</Label>
            <span>${totals.subtotal}</span>
          </div>

          <div className="flex justify-between">
            <Label>Total Discount:</Label>
            <span className="text-red-500">-${totals.totalDiscount}</span>
          </div>

          <div className="flex justify-between text-lg font-bold">
            <Label>Final Payable:</Label>
            <span>${totals.finalTotal}</span>
          </div>
        </CardContent>

        <CardFooter className="flex-col">
          <Button
            className="w-full"
            onClick={handleProcessSale}
            disabled={cart.length === 0 || processingSale}
          >
            {processingSale ? "Processing..." : "Process Sale"}
          </Button>

          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            Clear Cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
