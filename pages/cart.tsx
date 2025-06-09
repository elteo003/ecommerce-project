// pages/cart.tsx
import { useCart } from '../contexts/CartContext';
import Layout from '../components/Layout';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  const getTotal = () =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Il tuo carrello</h1>
        {items.length === 0 ? (
          <p className="text-gray-500">Il carrello è vuoto.</p>
        ) : (
          <>
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.productId} className="flex gap-4 bg-white shadow rounded-2xl p-4 items-center">
                  <img src={item.image ?? '/placeholder.png'} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500">Prezzo: {item.price} €</p>
                    <div className="flex items-center gap-2 mt-1">
                      <label htmlFor="qty" className="text-sm text-gray-500">Quantità:</label>
                      <input
                        id="qty"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateQuantity(item.productId, Number(e.target.value))}
                        className="w-16 border rounded px-2 py-1 text-center text-black"
                      />
                    </div>
                    <p className="text-md font-bold mt-1">Totale: {(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Rimuovi
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-right">
              <p className="text-xl font-bold">Totale Carrello: {getTotal()} €</p>
              <button className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition">
                Procedi al pagamento
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
