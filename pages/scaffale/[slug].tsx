import { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import prisma from '../../utils/prisma';
import { getPayloadFromReq } from '../../utils/auth';
import Layout from '../../components/Layout';
import FilterSidebar from '../../components/FilterSidebar';
import ProductCard from '../../components/ui/ProductCard';
import { FiFilter } from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  imageUrl: string | null;
  price?: number | null;
}

interface Props {
  title: string;
  slug: string;
  items: Product[];
  isAuthenticated: boolean;
}

const ScaffalePage: NextPage<Props> = ({ title, items, isAuthenticated }) => {
  const [open, setOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(Infinity);
  const [sortPriceAsc, setSortPriceAsc] = useState(true);
  const [filtered, setFiltered] = useState<Product[]>(items);

  useEffect(() => {
    let data = [...items];
    if (maxPrice !== Infinity) data = data.filter(p => (p.price ?? 0) <= maxPrice);
    data.sort((a, b) => sortPriceAsc ? ((a.price ?? 0) - (b.price ?? 0)) : ((b.price ?? 0) - (a.price ?? 0)));
    setFiltered(data);
  }, [items, maxPrice, sortPriceAsc]);

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-4 flex items-center">
        <button
          onClick={() => setOpen(true)}
          className="p-2 mr-4 text-2xl text-white hover:text-gray-200"
        ><FiFilter /></button>
        <h1 className="text-3xl font-bold text-white flex-1 text-center">{title}</h1>
      </div>

      <div className="flex relative">
        <FilterSidebar
          open={open}
          setOpen={setOpen}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sortPriceAsc={sortPriceAsc}
          setSortPriceAsc={setSortPriceAsc}
          selectedTags={[]}
          setSelectedTags={() => {}}
          selectedArtisans={[]}
          setSelectedArtisans={() => {}}
          selectedMaterials={[]}
          setSelectedMaterials={() => {}}
        />

        <section className="flex-1 px-4 pb-6">
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}
          >
            {(isAuthenticated ? filtered : items).map(p => (
              <ProductCard key={p.id} product={p} showPrice={isAuthenticated} />
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        .__filter_sidebar ul { list-style: none; margin: 0; padding: 0; }
        .slick-dots { display: none !important; }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, req }) => {
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || '';
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { products: { orderBy: { createdAt: 'desc' } } },
  });
  if (!category) return { notFound: true };

  const payload = getPayloadFromReq(req as any);
  const isAuthenticated = Boolean(payload);

  const items: Product[] = category.products.map(p => ({
    id: p.id,
    name: p.name,
    imageUrl: p.imageUrl ?? null,
    price: isAuthenticated ? p.price : null,
  }));

  return { props: { title: category.name, slug, items, isAuthenticated } };
};

export default ScaffalePage;
