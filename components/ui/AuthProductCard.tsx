// components/ui/AuthProductCard.tsx
import React from 'react';
import Link from 'next/link';

export interface AuthProduct {
  id: string;
  name: string;
  image: string | null;
  price: number;
}

interface Props {
  product: AuthProduct;
  onAdd: () => void;
}

export default function AuthProductCard({ product, onAdd }: Props) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <Link href={`/prodotto/${product.id}`}>  {/* usa rotta italiana */}
        <img
          src={product.image ?? '/placeholder.png'}
          alt={product.name}
          className="w-full h-32 object-cover cursor-pointer"
        />
      </Link>
      <div className="p-2">
        <Link href={`/prodotto/${product.id}`}>  {/* corretto */}
          <h3 className="text-base font-semibold text-black group-hover:text-red-500 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="font-bold text-sm">€{product.price.toFixed(2)}</p>
        <button
          onClick={onAdd}
          className="mt-2 w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
        >
          Aggiungi
        </button>
      </div>
    </div>
  );
}
