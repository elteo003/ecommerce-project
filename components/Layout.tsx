// components/Layout.tsx
import React, { ReactNode, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import SidebarMenu from './ui/SidebarMenu'
import ScrollNav from './ui/ScrollNav'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()

  // Hero è il primo child, scaffali il resto
  const sections = React.Children.toArray(children)
  const hero = sections[0]
  const shelves = sections.slice(1)
  const sectionIds = shelves.map((_, i) => `scaffale-${i + 1}`)

  return (
    <div className="layout relative flex flex-col h-screen overflow-hidden">
      {/* Pulsante hamburger fisso in alto a destra */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        className="fixed top-4 right-4 z-50 p-2 bg-transparent hover:bg-white/10 rounded-lg"
        aria-label="Apri menu"
      >
        <img src="/img/hamburger.png" alt="Menu" width={28} height={28} />
      </button>

      {/* SidebarMenu e ScrollNav */}
      <SidebarMenu
  open={menuOpen}
  onClose={() => setMenuOpen(false)}
  isAuthenticated={Boolean(user)}
  isArtisan={user?.role === 'artisan'}
/>

      <ScrollNav sectionIds={sectionIds} />

      {/* Contenuto principale */}
      <main className="mt-0 flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory pt-0">
        {/* Hero full-screen */}
        <section id="hero" className="h-screen snap-start">
          {hero}
        </section>
        {/* Scaffali full-screen, con spazio per l’header */}
        {shelves.map((child, idx) => (
          <section
            key={idx}
            id={`scaffale-${idx + 1}`}
            className="h-screen pt-0 snap-start"
          >
            {child}
          </section>
        ))}
      </main>
    </div>
  )
}
