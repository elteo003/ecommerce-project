// pages/index.tsx
import { NextPage } from 'next';
import React from 'react';
import prisma from '../utils/prisma';
import Layout from '../components/Layout';
import HeroSection from '../components/ui/HeroSection';
import ShelfSection from '../components/ui/ShelfSection';
import ProductCard from '../components/ui/ProductCard';
import { useAuth } from '../contexts/AuthContext';

interface ProductItem {
  id: string;
  name: string;
  description?: string | null;
  imageUrl: string | null;
  price: number;
}

interface CategoryWithProducts {
  slug: string;
  name: string;
  products: ProductItem[];
}

interface HomeProps {
  categories: CategoryWithProducts[];
}

const Home: NextPage<HomeProps> = ({ categories }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700">
        <HeroSection />
      </div>

      {categories.map((cat) => (
        <ShelfSection key={cat.slug} title={cat.name} slug={cat.slug}>
          {cat.products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                imageUrl: p.imageUrl,
                price: p.price,
                description: p.description ?? null,
              }}
              showPrice={isAuthenticated}
            />
          ))}
        </ShelfSection>
      ))}
    </Layout>
  );
};

export async function getServerSideProps() {
  const cats = await prisma.category.findMany({
    include: { products: { take: 3, orderBy: { createdAt: 'desc' } } },
  });

  const categories: CategoryWithProducts[] = cats.map((c) => ({
    slug: c.slug,
    name: c.name,
    products: c.products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      imageUrl: p.imageUrl,
      price: p.price,
    })),
  }));

  return { props: { categories } };
}

export default Home;
