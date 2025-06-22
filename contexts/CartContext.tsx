// contexts/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  productId: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  total: number;
  items: CartItem[];
}

interface CartContextType {
  items: CartItem[];
  pastOrders: Order[];
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
  reload: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);

  const load = async () => {
    if (!isAuthenticated) {
      setItems([]);
      setPastOrders([]);
      return;
    }
    // Carica carrello attivo
    const cartRes = await fetch('/api/cart', { credentials: 'include' });
    if (cartRes.ok) {
      const { items: raw } = await cartRes.json();
      setItems(
      raw.map((ci: any) => ({
      productId: ci.productId,
      name: ci.name,
      image: ci.imageUrl,
      price: ci.price,
      quantity: ci.quantity,
   }))
    );
    }
    // Carica ordini passati
    const ordersRes = await fetch('/api/orders', { credentials: 'include' });
    if (ordersRes.ok) {
      const { orders } = await ordersRes.json();
      setPastOrders(
        orders.map((o: any) => ({
          id: o.id,
          createdAt: o.createdAt,
          total: o.total,
          items: o.items.map((i: any) => ({
            productId: i.productId,
            name: i.name,
            image: null,
            price: i.price,
            quantity: i.quantity,
          })),
        }))
      );
    }
  };

  useEffect(() => {
    load();
  }, [isAuthenticated]);

  const addItem = async (productId: string, quantity: number) => {
    await fetch('/api/cart', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    await load();
  };

  const updateItem = async (productId: string, quantity: number) => {
    await fetch(`/api/cart/${productId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    await load();
  };

  const removeItem = async (productId: string) => {
    await fetch(`/api/cart/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await load();
  };

  const clearCart = async () => {
    await fetch('/api/cart', {
      method: 'DELETE',
      credentials: 'include',
    });
    await load();
  };

  const checkout = async () => {
    await fetch('/api/checkout', {
      method: 'POST',
      credentials: 'include',
    });
    await load();
  };

  return (
    <CartContext.Provider
      value={{ items, pastOrders, addItem, updateItem, removeItem, clearCart, checkout, reload: load }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve essere usato dentro CartProvider');
  return ctx;
}
