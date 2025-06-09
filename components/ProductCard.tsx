// components/ui/ProductCard.tsx
import React from 'react';
import Link from 'next/link';

interface Props {
  id: string;
  name: string;
  image: string | null;
}

export default function ProductCard({ id, name, image }: Props) {
  return (
    <Link
      href={`/product/${id}`}
      className="group block bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105"
    >
      <img
        src={image ?? '/placeholder.png'}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-black group-hover:text-red-500 transition-colors">
          {name}
        </h3>
      </div>
    </Link>
  );
}
