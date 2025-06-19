// components/ui/ShelfSection.tsx
import React, { ReactNode } from 'react';
import Link from 'next/link';

export interface ShelfSectionProps {
  title: string;
  href?: string;       // se presente, il titolo diventa link
  children: ReactNode;
}

export default function ShelfSection({
  title,
  href,
  children,
}: ShelfSectionProps) {
  return (
    <section className="px-4 py-8">
      {href ? (
        <Link
          href={href}
          className="block text-2xl font-bold text-center no-underline"
        >
          {title}
        </Link>
      ) : (
        <h2 className="text-2xl font-bold text-center">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {children}
      </div>
    </section>
  );
}
