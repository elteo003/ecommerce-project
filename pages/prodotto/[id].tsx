// pages/products/[id].tsx
import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import prisma from '../../utils/prisma';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';

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
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const [qty, setQty] = useState<number>(1);

  const addToCart = async () => {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: qty }),
    });
    alert('Aggiunto al carrello');
  };

  const buyNow = async () => {
    await addToCart();
    window.location.href = '/cart';
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="w-full h-96 mb-6">
          <img
            src={product.imageUrl ?? '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
        <p className="text-lg text-white mb-8">
          {product.description ?? 'Nessuna descrizione disponibile.'}
        </p>

        {isAuthenticated ? (
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <label className="text-white flex items-center gap-2">
              Quantità:
              <input
                type="number"
                min={1}
                value={qty}
                onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                className="w-20 px-3 py-2 rounded-lg border border-gray-300 text-black bg-white text-center focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              />
            </label>
            <button
              onClick={addToCart}
              className="bg-gray-400 hover:bg-gray-500 active:bg-gray-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition"
            >
              Aggiungi al carrello
            </button>
            <button
              onClick={buyNow}
              className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition"
            >
              Compra ora
            </button>
            {/* Prezzo dinamico a destra */}
            <span className="text-2xl font-semibold text-white">
              €{(product.price * qty).toFixed(2)}
            </span>
          </div>
        ) : (
          <p className="text-center italic text-white">
            <a href="/login" className="text-blue-300 hover:underline">
              Accedi
            </a>{' '}
            per vedere il prezzo e le opzioni di acquisto.
          </p>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const { id } = params as { id: string };
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return { notFound: true };

  return {
    props: {
      product: {
        id: p.id,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
        price: p.price,
      },
    },
  };
};

export default ProductPage;
