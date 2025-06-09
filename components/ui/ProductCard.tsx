// components/ui/ProductCard.tsx
import React from 'react'
import Link from 'next/link'

interface Props {
  product: {
    id: string
    name: string
    imageUrl: string | null
    price?: number | null
    description?: string | null
  }
  showPrice?: boolean
}

export default function ProductCard({ product, showPrice = false }: Props) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <Link href={`/prodotto/${product.id}`}>
        <img
          src={product.imageUrl ?? '/placeholder.png'}
          alt={product.name}
          className="w-full h-48 object-cover cursor-pointer"
        />
      </Link>
      <div className="p-4">
        <Link href={`/prodotto/${product.id}`}>
          <h3 className="text-lg font-semibold text-black group-hover:text-red-500 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        )}
        {showPrice && product.price != null && (
          <p className="font-bold mt-2">€{product.price.toFixed(2)}</p>
        )}
      </div>
    </div>
  )
}
