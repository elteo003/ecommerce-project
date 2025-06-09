// components/ui/ArtisanSection.tsx
import React from 'react'
import Link from 'next/link'

interface ArtisanSectionProps {
  title: string
  description: string
  href: string
}

export default function ArtisanSection({ title, description, href }: ArtisanSectionProps) {
  return (
    <section className="my-16 bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center">
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
          <Link href={href}>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Vai al Pannello Artigiani
            </button>
          </Link>
        </div>
        <div className="md:w-1/3 mt-8 md:mt-0">
          {/* Placeholder per immagine o icona */}
          <img
            src="/artisan-dashboard.png"
            alt="Dashboard Artigiani"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}
