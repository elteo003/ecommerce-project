import React from 'react';
import Link from 'next/link';

export interface AuthProduct {
  id: string;
  name: string;
  image: string | null;
  price: number;
}

interface AuthProductCardProps {
  product: AuthProduct;
  onAdd: () => void;
}

export default function AuthProductCard({ product, onAdd }: AuthProductCardProps) {
  const imgSrc = product.image || '/img/default.jpg';

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col">
      <Link
        href={`/product/${product.id}`}
        className="block"
      >
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-40 object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/img/default.jpg'; }}
        />
        <div className="p-2">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="mt-1 font-bold">€ {product.price.toFixed(2)}</p>
        </div>
      </Link>
      <button
        onClick={onAdd}
        className="mt-auto bg-green-600 text-white py-2 hover:bg-green-700 transition"
      >
        Aggiungi al carrello
      </button>
    </div>
  );
}
