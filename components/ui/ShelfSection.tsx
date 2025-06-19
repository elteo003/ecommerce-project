import React, { ReactNode } from 'react';
import Link from 'next/link';

export interface ShelfSectionProps {
  title: string;
  href?: string;
  children: ReactNode;
}

export default function ShelfSection({
  title,
  href,
  children,
}: ShelfSectionProps) {
  return (
    <section className="px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-blue-600 hover:underline"
          >
            Vedi tutti
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </section>
  );
}
