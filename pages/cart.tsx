// pages/cart.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function CartPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const { items, pastOrders, updateItem, removeItem, clearCart, checkout } = useCart();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  // Calcolo protetto dei totali
  const rawCartTotal = items.reduce((sum, i) => {
    const price = Number(i.price) || 0;
    const qty   = Number(i.quantity) || 0;
    return sum + price * qty;
  }, 0);
  const cartTotal = isNaN(rawCartTotal) ? 0 : rawCartTotal;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        {/* CARRELLO ATTIVO */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Carrello Attivo</h2>
          {items.length === 0 ? (
            <p>Carrello vuoto</p>
          ) : (
            <>
              <ul className="space-y-4">
                {items.map(item => {
                  const lineRaw = (Number(item.price) || 0) * (Number(item.quantity) || 0);
                  const lineTotal = isNaN(lineRaw) ? 0 : lineRaw;
                  return (
                    <li key={item.productId} className="flex items-center justify-between">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      <span>{item.name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateItem(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >–</button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateItem(item.productId, item.quantity + 1)}
                        >+</button>
                        <span>€{lineTotal.toFixed(2)}</span>
                        <button onClick={() => removeItem(item.productId)}>🗑️</button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex justify-between items-center mt-4">
                <span className="font-bold">
                  Totale: €{cartTotal.toFixed(2)}
                </span>
                <div className="space-x-4">
                  <button onClick={clearCart} className="px-4 py-2 bg-red-600 text-white rounded">
                    Svuota
                  </button>
                  <button onClick={checkout} className="px-4 py-2 bg-green-600 text-white rounded">
                    Compra tutto
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ORDINI PASSATI */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Ordini Passati</h2>
          {pastOrders.length === 0 ? (
            <p>Nessun ordine precedente</p>
          ) : (
            pastOrders.map((order, idx) => {
              const rawOrderTotal = order.items.reduce((sum, i) => {
                const price = Number(i.price) || 0;
                const qty   = Number(i.quantity) || 0;
                return sum + price * qty;
              }, 0);
              const orderTotal = isNaN(rawOrderTotal) ? 0 : rawOrderTotal;

              return (
                <div key={order.id} className="border p-4 rounded mb-4">
                  <h3 className="font-semibold mb-2">Ordine #{idx + 1}</h3>
                  <ul className="space-y-2">
                    {order.items.map(i => {
                      const lineRaw = (Number(i.price) || 0) * (Number(i.quantity) || 0);
                      const lineTotal = isNaN(lineRaw) ? 0 : lineRaw;
                      return (
                        <li key={i.productId} className="flex justify-between">
                          <span>{i.name} × {i.quantity}</span>
                          <span>€{lineTotal.toFixed(2)}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="text-right font-semibold">
                    Totale: €{orderTotal.toFixed(2)}
                  </p>
                </div>
              );
            })
          )}
        </section>
      </div>
    </Layout>
  );
}
