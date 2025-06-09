// components/ui/ShelfSection.tsx
import React, { ReactNode } from 'react'
import Link from 'next/link'

interface ShelfSectionProps {
  title: string
  slug: string
  children: ReactNode
}

export default function ShelfSection({ title, slug, children }: ShelfSectionProps) {
  return (
    <section className="my-16">
      <div className="flex justify-center items-center px-4 mb-24">
        <Link href={`/scaffale/${slug}`}>
          <h2 className="text-4xl font-bold text-white text-center cursor-pointer drop-shadow-lg">
            {title}
          </h2>
        </Link>
      </div>
      <div
        className="grid gap-6 px-4 
                   grid-cols-[repeat(auto-fit,minmax(150px,1fr))]"
      >
        {children}
      </div>
    </section>
  )
}
