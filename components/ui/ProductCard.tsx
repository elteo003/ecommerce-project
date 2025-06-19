// components/ui/ProductCard.tsx
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart, CartItem } from "../../contexts/CartContext";
import { useRouter } from "next/router";

interface Props {
  product: {
    id: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    price?: number | null;
  };
  showPrice: boolean;
}

export default function ProductCard({ product, showPrice }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addItem } = useCart();
  const [img, setImg] = useState(product.imageUrl || "/img/default.jpg");

  const handleBuy = () => {
    if (!session) return router.push("/login");
    addItem({
      id: product.id,
      name: product.name,
      price: product.price!,
      quantity: 1,
    } as CartItem);
    router.push("/cart");
  };

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden">
      <Link href={`/product/${product.id}`}>
        <a className="block">
          <img
            src={img}
            alt={product.name}
            className="w-full h-40 object-cover"
            onError={() => setImg("/img/default.jpg")}
          />
          <div className="p-2">
            <h3 className="font-semibold">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-gray-600">{product.description}</p>
            )}
          </div>
        </a>
      </Link>

      {showPrice && product.price != null && (
        <div className="px-2">
          <span className="font-bold">€ {product.price.toFixed(2)}</span>
        </div>
      )}

      <button
        onClick={handleBuy}
        className={`mt-auto m-2 py-2 rounded ${session
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
      >
        {session ? "Aggiungi al carrello" : "Effettua il login"}
      </button>
    </div>
  );
}
