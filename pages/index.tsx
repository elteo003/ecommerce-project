// pages/index.tsx
import { NextPage } from "next";
import React from "react";
import prisma from "../utils/prisma";
import Layout from "../components/Layout";
import HeroSection from "../components/ui/HeroSection";
import ShelfSection from "../components/ui/ShelfSection";
import ProductCard from "../components/ui/ProductCard";
import { useSession } from "next-auth/react";

interface P { id: string; name: string; description?: string; imageUrl?: string; price: number }
interface C { slug: string; name: string; products: P[] }

const Home: NextPage<{ categories: C[] }> = ({ categories }) => {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700">
        <HeroSection />
      </div>

      {categories.map(cat => (
        <ShelfSection key={cat.slug} title={cat.name} href={`/scaffale/${cat.slug}`}>
          {cat.products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              showPrice={Boolean(session)}
            />
          ))}
        </ShelfSection>
      ))}
    </Layout>
  );
};

export async function getServerSideProps() {
  const cats = await prisma.category.findMany({
    include: { products: { take: 3, orderBy: { createdAt: "desc" } } }
  });
  return {
    props: {
      categories: cats.map(c => ({
        slug: c.slug,
        name: c.name,
        products: c.products.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description ?? undefined,
          imageUrl: p.imageUrl ?? undefined,
          price: p.price
        }))
      }))
    }
  };
}

export default Home;
