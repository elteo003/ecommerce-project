// pages/cart.tsx
import React from "react";
import { useCart, CartItem } from "../contexts/CartContext";

export default function CartPage() {
  const { items, pastOrders, clearCart } = useCart();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Carrello Attivo</h2>
        {items.length === 0 ? (
          <p>Il carrello è vuoto.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item: CartItem) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>€ {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Checkout
          </button>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Ordini Passati</h2>
        {pastOrders.length === 0 ? (
          <p>Nessun ordine precedente.</p>
        ) : (
          pastOrders.map((order: CartItem[], idx: number) => {
            const orderTotal = order.reduce((sum, i) => sum + i.price * i.quantity, 0);
            return (
              <div key={idx} className="border p-4 rounded mb-4">
                <h3 className="font-semibold mb-2">Ordine #{idx + 1}</h3>
                <ul className="space-y-2 mb-4">
                  {order.map((item: CartItem) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span>€ {(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <footer className="text-right font-semibold">
                  Totale ordine: €{orderTotal.toFixed(2)}
                </footer>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
