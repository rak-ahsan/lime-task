// components/PosBody.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Product, api } from '@/lib/api';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';

/* UI imports omitted for brevity — assume your Card/Table/Button components are available */

interface Props {
  initialProducts: Product[];
}

export default function PosBody({ initialProducts }: Props) {
  const { cart, addItemToCart, updateItemQuantity, removeItemFromCart, calculateTotals, clearCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>(initialProducts || []);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [processingSale, setProcessingSale] = useState(false);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => {
      (async () => {
        if (searchTerm.trim().length < 2) {
          setSearchResults(initialProducts ?? []);
          return;
        }
        setLoadingSearch(true);
        try {
          const res = await api.get<Product[]>(`products?search=${encodeURIComponent(searchTerm)}`);
          setSearchResults(res);
        } catch (err) {
          console.error(err);
          toast.error('Failed to fetch products');
        } finally {
          setLoadingSearch(false);
        }
      })();
    }, 350);

    return () => clearTimeout(t);
  }, [searchTerm, initialProducts]);

  const handleAdd = useCallback((p: Product) => {
    addItemToCart(p, 1);
    setSearchTerm('');
    setSearchResults([]);
  }, [addItemToCart]);

  const totals = calculateTotals(); // safe: client-only cart context

  const processSale = async () => {
    if (cart.length === 0) {
      toast.warning('Cart is empty');
      return;
    }
    setProcessingSale(true);
    try {
      const token = localStorage.getItem('authToken') ?? '';
      const sale = {
        items: cart.map(i => ({
          product_id: i.product.id,
          quantity: i.quantity,
          unit_price: i.product.price,
        })),
        total_amount: totals.finalTotal,
        total_discount: totals.totalDiscount,
      };

      await api.post('pos', sale, token);
      toast.success('Sale processed');
      clearCart();
    } catch (err) {
      console.error(err);
      toast.error('Failed to process sale');
    } finally {
      setProcessingSale(false);
    }
  };

  return (
    <div className="flex min-h-screen p-4 bg-gray-50">
      {/* Left: Search */}
      <div className="w-full md:w-1/3 p-2">
        <input
          className="w-full p-2 border rounded"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loadingSearch && <div>Loading…</div>}
        <div className="mt-2 space-y-1 max-h-60 overflow-auto">
          {searchResults.map(p => (
            <div key={p.id} onClick={() => handleAdd(p)} className="p-2 hover:bg-gray-100 cursor-pointer border rounded">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">${p.price.toFixed(2)} — Stock: {p.stock}</div>
            </div>
          ))}
          {searchResults.length === 0 && !loadingSearch && <div className="text-sm text-gray-400">No products</div>}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-full md:w-2/3 p-2">
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold">Current Sale</h3>
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-6">No items</div>
          ) : (
            <table className="w-full mt-2">
              <thead>
                <tr>
                  <th>Product</th><th>Price</th><th>Qty</th><th>Discount</th><th>Total</th><th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => {
                  const itemTotal = item.product.price * item.quantity;
                  let itemDiscount = 0;
                  if (item.product.discount_details) {
                    const { type, value } = item.product.discount_details;
                    if (type === 'percentage') itemDiscount = itemTotal * (value / 100);
                    else itemDiscount = value * item.quantity;
                  }
                  return (
                    <tr key={item.product.id}>
                      <td>{item.product.name}</td>
                      <td>${item.product.price.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          max={item.product.stock}
                          onChange={(e) => updateItemQuantity(item.product.id, Math.max(1, Number(e.target.value)))}
                          className="w-20 p-1 border rounded"
                        />
                      </td>
                      <td>{itemDiscount ? `-${itemDiscount.toFixed(2)}` : 'N/A'}</td>
                      <td>${(itemTotal - itemDiscount).toFixed(2)}</td>
                      <td>
                        <button onClick={() => removeItemFromCart(item.product.id)} className="text-red-600">Remove</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div className="mt-4 flex justify-between">
            <div>Subtotal</div>
            <div>${totals.subtotal.toFixed(2)}</div>
          </div>
          <div className="mt-1 flex justify-between">
            <div>Total Discount</div>
            <div className="text-red-500">-${totals.totalDiscount.toFixed(2)}</div>
          </div>
          <div className="mt-2 flex justify-between text-lg font-bold">
            <div>Final</div>
            <div>${totals.finalTotal.toFixed(2)}</div>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={processSale} disabled={processingSale || cart.length === 0} className="btn-primary">
              {processingSale ? 'Processing…' : 'Process Sale'}
            </button>
            <button onClick={clearCart} disabled={cart.length === 0} className="btn-outline">Clear Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
