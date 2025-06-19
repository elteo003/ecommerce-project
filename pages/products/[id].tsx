import { GetServerSideProps, NextPage } from "next";
import React from "react";
import prisma from "../../utils/prisma";
import Layout from "../../components/Layout";

interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

interface Props {
  product: Product;
  isAuthenticated: boolean;
}

const ProductPage: NextPage<Props> = ({ product, isAuthenticated }) => {
  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6 text-center">
        {/* Fotografia grande */}
        <img
          src={product.imageUrl || "/img/default.jpg"}
          alt={product.name}
          className="w-full h-auto object-cover rounded mb-6"
          onError={(e) =>
            ((e.currentTarget as HTMLImageElement).src = "/img/default.jpg")
          }
        />

        {/* Nome al centro */}
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

        {/* Piccola descrizione */}
        <p className="text-gray-700 mb-6">
          {product.description || "Nessuna descrizione disponibile."}
        </p>

        {/* Solo se sei loggato compaiono i bottoni sotto */}
        {isAuthenticated && (
          <div className="flex justify-center gap-4">
            {/* Aggiungi al carrello */}
            <button
              onClick={async () => {
                await fetch("/api/cart", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId: product.id, quantity: 1 }),
                });
                alert("Aggiunto al carrello");
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Aggiungi al carrello
            </button>
            {/* Compra ora */}
            <button
              onClick={() => (window.location.href = "/cart")}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Compra ora
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
  req,
}) => {
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id!;
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return { notFound: true };

  // controlla login
  const { getPayloadFromReq } = await import("../../utils/auth");
  const payload = getPayloadFromReq(req as any);

  return {
    props: {
      product: {
        id: p.id,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
      },
      isAuthenticated: Boolean(payload),
    },
  };
};

export default ProductPage;
