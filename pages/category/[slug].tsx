// pages/scaffale/[slug].tsx
import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import prisma from "../../utils/prisma";
import Layout from "../../components/Layout";
import { FiFilter } from "react-icons/fi";
import FilterSidebar from "../../components/FilterSidebar";
import ProductCard from "../../components/ui/ProductCard";
import { getPayloadFromReq } from "../../utils/auth";

interface Product {
    id: string;
    name: string;
    imageUrl?: string | null;
    price?: number | null;
}

interface Props {
    title: string;
    items: Product[];
    isAuth: boolean;
}

const ScaffalePage: NextPage<Props> = ({ title, items, isAuth }) => {
    const [open, setOpen] = useState(false);
    const [maxPrice, setMaxPrice] = useState<number>(Infinity);
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedArtisans, setSelectedArtisans] = useState<string[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [filtered, setFiltered] = useState<Product[]>(items);

    useEffect(() => {
        let data = [...items];
        // applica filtro prezzo
        if (maxPrice < Infinity) {
            data = data.filter(p => (p.price ?? 0) <= maxPrice);
        }
        // applica ordinamento
        data.sort((a, b) =>
            sortAsc
                ? ((a.price ?? 0) - (b.price ?? 0))
                : ((b.price ?? 0) - (a.price ?? 0))
        );
        // (opzionale) potresti qui anche applicare filtri per tag/artigiani/materiali
        setFiltered(data);
    }, [items, maxPrice, sortAsc]);

    return (
        <Layout>
            <div className="flex items-center p-4 bg-red-600 text-white">
                <button onClick={() => setOpen(true)}>
                    <FiFilter size={24} />
                </button>
                <h1 className="flex-1 text-center text-2xl">{title}</h1>
            </div>

            <div className="flex">
                <FilterSidebar
                    open={open}
                    setOpen={setOpen}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    sortAsc={sortAsc}
                    setSortAsc={setSortAsc}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    selectedArtisans={selectedArtisans}
                    setSelectedArtisans={setSelectedArtisans}
                    selectedMaterials={selectedMaterials}
                    setSelectedMaterials={setSelectedMaterials}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 flex-1">
                    {(isAuth ? filtered : items).map(p => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            showPrice={isAuth}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, req }) => {
    const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug!;
    const cat = await prisma.category.findUnique({
        where: { slug },
        include: { products: { orderBy: { createdAt: "desc" } } },
    });
    if (!cat) return { notFound: true };

    const payload = getPayloadFromReq(req as any);
    return {
        props: {
            title: cat.name,
            items: cat.products.map(p => ({
                id: p.id,
                name: p.name,
                imageUrl: p.imageUrl,
                price: payload ? p.price : null,
            })),
            isAuth: Boolean(payload),
        },
    };
};

export default ScaffalePage;
