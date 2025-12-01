'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { calculateProductPricing } from '../../lib/pricing';
import { Product } from '../../types/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addItemToCart: (product: Product, quantity?: number) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItemFromCart: (productId: string) => void;
  clearCart: () => void;
  calculateTotals: () => {
    subtotal: number;
    totalDiscount: number;
    finalTotal: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItemToCart = useCallback((product: Product, quantityToAdd: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.product.id === product.id);

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        const currentQuantity = updatedCart[existingItemIndex].quantity;
        const newQuantity = currentQuantity + quantityToAdd;

        if (newQuantity > product.stock) {
          console.warn(`Cannot add more than available stock for ${product.name}`);
          return prevCart;
        }

        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: newQuantity,
        };
        return updatedCart;
      } else {
        if (quantityToAdd > product.stock) {
          console.warn(`Cannot add more than available stock for ${product.name}`);
          return prevCart;
        }
        return [...prevCart, { product, quantity: quantityToAdd }];
      }
    });
  }, []);

  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex((item) => item.product.id === productId);

      if (itemIndex > -1) {
        const product = prevCart[itemIndex].product;
        if (quantity <= 0) {
          return prevCart.filter((item) => item.product.id !== productId);
        }
        if (quantity > product.stock) {
          console.warn(`Cannot set quantity more than available stock for ${product.name}`);
          return prevCart;
        }

        const updatedCart = [...prevCart];
        updatedCart[itemIndex] = { ...updatedCart[itemIndex], quantity };
        return updatedCart;
      }
      return prevCart;
    });
  }, []);

  const removeItemFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const calculateItemPrice = (item: CartItem): { price: number; discountAmount: number } => {
    const effectivePrice = item.product.price * item.quantity;
    let itemDiscount = 0;

    if (item.product.discount_details) {
      const { type, value } = item.product.discount_details;
      if (type === 'percentage') {
        itemDiscount = effectivePrice * (value / 100);
      } else if (type === 'fixed') {
        itemDiscount = value * item.quantity;
      }
    }

    return { price: effectivePrice - itemDiscount, discountAmount: itemDiscount };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function calculateTotals() {
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


  const value = React.useMemo(
    () => ({
      cart,
      addItemToCart,
      updateItemQuantity,
      removeItemFromCart,
      clearCart,
      calculateTotals,
    }),
    [cart, addItemToCart, updateItemQuantity, removeItemFromCart, clearCart, calculateTotals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
