'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

import { calculateProductPricing } from '../../lib/pricing';
import { Product } from '../../types/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface Totals {
  subtotal: string;
  totalDiscount: string;
  finalTotal: string;
}

interface CartContextType {
  cart: CartItem[];
  addItemToCart: (product: Product, quantity?: number) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItemFromCart: (productId: string) => void;
  clearCart: () => void;
  calculateTotals: () => Totals;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItemToCart = useCallback(
    (product: Product, quantityToAdd: number = 1) => {
      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex(
          (item) => item.product.id === product.id
        );

        if (existingIndex > -1) {
          const updated = [...prevCart];
          const currentQty = updated[existingIndex].quantity;
          const newQty = currentQty + quantityToAdd;

          if (newQty > product.stock) return prevCart;

          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
          };

          return updated;
        }

        if (quantityToAdd > product.stock) return prevCart;

        return [...prevCart, { product, quantity: quantityToAdd }];
      });
    },
    []
  );

  const updateItemQuantity = useCallback(
    (productId: string, quantity: number) => {
      setCart((prevCart) => {
        const index = prevCart.findIndex(
          (item) => item.product.id === productId
        );

        if (index === -1) return prevCart;

        const product = prevCart[index].product;

        if (quantity <= 0) {
          return prevCart.filter((item) => item.product.id !== productId);
        }

        if (quantity > product.stock) return prevCart;

        const updated = [...prevCart];
        updated[index] = { ...updated[index], quantity };
        return updated;
      });
    },
    []
  );

  const removeItemFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  function calculateTotals(): Totals {
    let subtotal = 0;
    let totalDiscount = 0;
    let finalTotal = 0;

    cart.forEach((item) => {
      const calc = calculateProductPricing(item);

      subtotal += calc.itemTotal + calc.discountAmount;
      totalDiscount += calc.discountAmount;
      finalTotal += calc.finalPrice;
    });

    return {
      subtotal: subtotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      finalTotal: finalTotal.toFixed(2),
    };
  }

  const value: CartContextType = {
    cart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart,
    calculateTotals,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
