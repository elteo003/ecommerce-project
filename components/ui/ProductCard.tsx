// components/ui/ProductCard.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCart, CartItem } from '../../contexts/CartContext';

interface Product {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price?: number | null;
}
interface ProductCardProps {
  product: Product;
  showPrice: boolean;
}

export default function ProductCard({ product, showPrice }: ProductCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addItem } = useCart();
  const [img, setImg] = useState(product.imageUrl || '/img/default.jpg');

  const handleBuy = () => {
    if (status !== 'authenticated') return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price!,
      quantity: 1,
    } as CartItem);
    router.push('/cart');
  };

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden">
      <Link
        href={`/product/${product.id}`}
        className="block no-underline"
      >
        <img
          src={img}
          alt={product.name}
          className="w-full h-40 object-cover"
          onError={() => setImg('/img/default.jpg')}
        />
        <div className="p-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          )}
        </div>
      </Link>

      {showPrice && product.price != null && (
        <div className="px-2">
          <span className="font-bold">€ {product.price.toFixed(2)}</span>
        </div>
      )}

      {status === 'authenticated' && (
        <button
          onClick={handleBuy}
          className="mt-auto m-2 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Aggiungi al carrello
        </button>
      )}
    </div>
  );
}
