// pages/auth/index.tsx

import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import prisma from '../../utils/prisma';
import { getPayloadFromReq } from '../../utils/auth';
import Layout from '../../components/Layout';
import HeroSection from '../../components/ui/HeroSection';
import ShelfSection from '../../components/ui/ShelfSection';
import AuthProductCard, { AuthProduct } from '../../components/ui/AuthProductCard';

interface CategoryWithProducts {
    slug: string;
    name: string;
    products: AuthProduct[];
}

interface AuthHomeProps {
    categories: CategoryWithProducts[];
}

const AuthHome: NextPage<AuthHomeProps> = ({ categories }) => {
    const addToCart = async (id: string) => {
        await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: id }),
        });
        window.location.reload();
    };

    return (
        <Layout>
            <HeroSection />

            {/* Sezioni “scaffale” per ogni categoria */}
            {categories.map((cat) => (
                <ShelfSection key={cat.slug} title={cat.name}>
                    {cat.products.map((p) => (
                        <AuthProductCard
                            key={p.id}
                            product={p}
                            onAdd={() => addToCart(p.id)}
                        />
                    ))}
                </ShelfSection>
            ))}
        </Layout>
    );
};

export default AuthHome;

export const getServerSideProps: GetServerSideProps<AuthHomeProps> = async ({
    req,
}) => {
    const payload = getPayloadFromReq(req as any);
    if (!payload) {
        return { redirect: { destination: '/login', permanent: false } };
    }

    // Prendi tutte le categorie con i primi 3 prodotti
    const cats = await prisma.category.findMany({
        include: {
            products: {
                take: 3,
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    const categories: CategoryWithProducts[] = cats.map((c) => ({
        slug: c.slug,
        name: c.name,
        products: c.products.map((p) => ({
            id: p.id,
            name: p.name,
            image: p.imageUrl ?? null,
            price: p.price,
        })),
    }));

    return { props: { categories } };
};
