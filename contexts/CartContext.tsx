// context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface CartContextType {
  items: CartItem[];
  pastOrders: CartItem[][];
  addItem: (item: CartItem) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [pastOrders, setPastOrders] = useState<CartItem[][]>([]);

  // carica da localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    const past = localStorage.getItem("pastOrders");
    if (saved) setItems(JSON.parse(saved));
    if (past) setPastOrders(JSON.parse(past));
  }, []);

  // salva su localStorage
  useEffect(() => { localStorage.setItem("cart", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("pastOrders", JSON.stringify(pastOrders)); }, [pastOrders]);

  const addItem = (item: CartItem) => {
    setItems(curr => {
      const exist = curr.find(i => i.id === item.id);
      if (exist) {
        return curr.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...curr, item];
    });
  };

  const clearCart = () => {
    if (items.length) {
      setPastOrders(p => [...p, items]);
      setItems([]);
    }
  };

  return (
    <CartContext.Provider value={{ items, pastOrders, addItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve essere usato dentro CartProvider");
  return ctx;
}
