// pages/category/[slug].tsx

import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import prisma from '../../utils/prisma';
import { getPayloadFromReq } from '../../utils/auth';
import Layout from '../../components/Layout';
import ShelfSection from '../../components/ui/ShelfSection';
import ProductCard, { Product as PublicProduct } from '../../components/ui/ProductCard';
import AuthProductCard, { AuthProduct } from '../../components/ui/AuthProductCard';

interface Props {
    title: string;
    items: Array<AuthProduct | (PublicProduct & { price: null })>;
}

const CategoryPage: NextPage<Props> = ({ title, items }) => {
    const isAuth = items.length > 0 && (items[0] as AuthProduct).price !== null;

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
            <h1 style={{ padding: '1rem' }}>{title}</h1>
            <ShelfSection title="">
                {items.map((item) =>
                    isAuth ? (
                        <AuthProductCard
                            key={item.id}
                            product={item as AuthProduct}
                            onAdd={() => addToCart(item.id)}
                        />
                    ) : (
                        <ProductCard
                            key={item.id}
                            product={item as PublicProduct}
                        />
                    )
                )}
            </ShelfSection>
        </Layout>
    );
};

export default CategoryPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, req }) => {
    const rawSlug = params?.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || '';

    const mapping: Record<string, string> = {
        'grandi-classici': 'Grandi classici',
        'nuova-collezione': 'Nuova collezione',
        'piu-venduti': 'I più venduti',
    };
    const title = mapping[slug] ?? slug;

    const prods = await prisma.product.findMany({
        where: { category: { slug } },
        take: 3,
        orderBy: { createdAt: 'desc' },
    });

    const payload = getPayloadFromReq(req as any);
    const items = prods.map((p) => {
        const common = {
            id: p.id,
            name: p.name,
            image: p.imageUrl ?? null,
        };
        if (payload) {
            return {
                ...common,
                price: p.price,
            } as AuthProduct;
        } else {
            return {
                ...common,
                price: null,
            } as PublicProduct & { price: null };
        }
    });

    return { props: { title, items } };
};
