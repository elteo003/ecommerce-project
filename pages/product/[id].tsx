// pages/products/[id].tsx
import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import prisma from '../../utils/prisma';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
}

interface Props {
  product: Product;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const { user, isLoading } = useAuth();
  const isAuthenticated = Boolean(user) && !isLoading;
  const [qty, setQty] = useState<number>(1);

  const addToCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: qty }),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error('Errore POST /api/cart:', err);
        alert('Errore durante l\'aggiunta al carrello');
        return;
      }
      alert('Aggiunto al carrello');
    } catch (e) {
      console.error(e);
      alert('Errore di rete');
    }
  };

  const buyNow = async () => {
    await addToCart();
    window.location.href = '/cart';
  };

  if (isLoading) {
    return <p className="text-center py-10">Caricamento...</p>;
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Immagine */}
        <div className="w-full h-96 mb-6">
          <img
            src={product.imageUrl ?? '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/placeholder.png';
            }}
          />
        </div>

        {/* Titolo e descrizione */}
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-lg mb-8">
          {product.description ?? 'Nessuna descrizione disponibile.'}
        </p>

        {isAuthenticated ? (
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <label className="flex items-center gap-2 text-black">
              Quantità:
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                className="w-20 px-3 py-2 rounded-lg border text-center"
              />
            </label>

            <button
              onClick={buyNow}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Compra ora
            </button>

            <span className="text-2xl font-semibold">
              €{(product.price * qty).toFixed(2)}
            </span>
          </div>
        ) : (
          <p className="text-center italic">
            <Link
              href="/auth/login"
              className="text-blue-600 hover:underline"
            >
              Accedi
            </Link>{' '}
            per vedere il prezzo e le opzioni di acquisto.
          </p>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id!;
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return { notFound: true };

  return {
    props: {
      product: {
        id: p.id,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl ?? null,
        price: p.price ?? 0,
      },
    },
  };
};

export default ProductPage;
