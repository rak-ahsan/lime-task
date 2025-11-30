'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product } from '@/lib/api'; // Import Product from api.ts

// Define the shape of an item in the cart
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define the shape of the Cart Context
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

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItemToCart = useCallback((product: Product, quantityToAdd: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.product.id === product.id);

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedCart = [...prevCart];
        const currentQuantity = updatedCart[existingItemIndex].quantity;
        const newQuantity = currentQuantity + quantityToAdd;

        if (newQuantity > product.stock) {
          console.warn(`Cannot add more than available stock for ${product.name}`);
          // Optionally, return prevCart without updating, or update to max stock
          return prevCart;
        }

        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: newQuantity,
        };
        return updatedCart;
      } else {
        // New item
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
          // Remove item if quantity is 0 or less
          return prevCart.filter((item) => item.product.id !== productId);
        }
        if (quantity > product.stock) {
          console.warn(`Cannot set quantity more than available stock for ${product.name}`);
          return prevCart; // Prevent setting quantity above stock
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
    let effectivePrice = item.product.price * item.quantity;
    let itemDiscount = 0;

    if (item.product.discount_details) {
      const { type, value } = item.product.discount_details;
      if (type === 'percentage') {
        itemDiscount = effectivePrice * (value / 100);
      } else if (type === 'fixed') {
        itemDiscount = value * item.quantity; // Apply fixed discount per item
      }
    }
    // Note: For trade offers, the logic might be more complex and could affect total quantity or price
    // For now, assuming trade offers are informative text and not direct price modifiers here.

    return { price: effectivePrice - itemDiscount, discountAmount: itemDiscount };
  };

  const calculateTotals = useCallback(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let finalTotal = 0;

    cart.forEach((item) => {
      const itemOriginalPrice = item.product.price * item.quantity;
      subtotal += itemOriginalPrice;

      const { discountAmount } = calculateItemPrice(item);
      totalDiscount += discountAmount;
    });

    finalTotal = subtotal - totalDiscount;

    return {
      subtotal,
      totalDiscount,
      finalTotal,
    };
  }, [cart]);

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

// Custom hook to use the Cart Context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
