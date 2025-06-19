import React from 'react';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';

export default function CartIcon() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Link href="/cart" className="relative">
      <FaShoppingCart size={24} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
