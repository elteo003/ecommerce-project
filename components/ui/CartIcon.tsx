// components/ui/CartIcon.tsx
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';

export default function CartIcon() {
  const { totalQuantity } = useCart();

  return (
    <Link href="/cart" className="relative">
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1 5m13-5l1 5m-14 0h14" />
      </svg>
      {totalQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}
