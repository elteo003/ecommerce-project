// pages/dashboard/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';

interface Stats {
  productId: string;
  name: string;
  sold: number;
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats[]>([]);

  useEffect(() => {
    // Aspetta che il context finisca di caricare l'utente
    if (isLoading) return;

    // Se non è autenticato come ARTISAN, reindirizza
    if (!isAuthenticated || user?.role !== 'ARTISAN') {
      router.replace('/auth/artisan-login');
      return;
    }

    // Altrimenti carica le statistiche
    fetch('/api/artisan/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats([]));
  }, [isLoading, isAuthenticated, user, router]);

  // Durante il caricamento non renderizzare nulla (o mostra uno spinner)
  if (isLoading) {
    return null;
  }

  // Se non è artisan, non renderizzare
  if (!isAuthenticated || user?.role !== 'ARTISAN') {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto my-12 px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-2">Pannello di Controllo Artigiani</h1>
        <p className="text-lg text-black mb-8">
          Dashboard per monitorare le vendite, aggiornare prodotti e gestire lo stock.
        </p>

        {/* Statistiche principali */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Prodotti Più Venduti</h2>
          {stats.length > 0 ? (
            <ul className="space-y-2">
              {stats.map(s => (
                <li key={s.productId} className="flex justify-between p-3 bg-gray-100 rounded">
                  <span>{s.name}</span>
                  <span className="font-semibold">{s.sold} venduti</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-black">Ancora nessuna vendita registrata.</p>
          )}
        </section>

        {/* Azioni rapide */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Aggiorna Prodotti</h3>
            <p className="text-gray-600 mb-4">Modifica dettagli, prezzi e descrizioni dei tuoi prodotti.</p>
            <button
              onClick={() => router.push('/dashboard/products')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Vai ad Aggiorna
            </button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Gestisci Stock</h3>
            <p className="text-gray-600 mb-4">Monitora e aggiorna le giacenze del magazzino.</p>
            <button
              onClick={() => router.push('/dashboard/stock')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Vai a Stock
            </button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Crea Nuovo Prodotto</h3>
            <p className="text-gray-600 mb-4">Aggiungi un nuovo articolo al tuo catalogo.</p>
            <button
              onClick={() => router.push('/dashboard/new-product')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Crea Prodotto
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
