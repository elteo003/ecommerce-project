// components/Layout.tsx
import React, { ReactNode } from 'react'
import SidebarMenu from './ui/SidebarMenu'
import ScrollNav from './ui/ScrollNav'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  // Children: Hero + scaffali
  const allChildren = React.Children.toArray(children)
  const heroChild = allChildren[0]
  const shelfChildren = allChildren.slice(1)
  // Genera gli ID per gli scaffali: 'scaffale-1', 'scaffale-2', ...
  const sectionIds = shelfChildren.map((_, i) => `scaffale-${i + 1}`)

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Navbar con Home, link auth/cart, hamburger e sidebar */}
      {/* Rimuoviamo la navbar superiore; usiamo solo il sidebar a scomparsa */}

      {/* Indicatori di navigazione laterali per gli scaffali */}
      <ScrollNav sectionIds={sectionIds} />

      {/* Container scrollabile con snap */}
      <main
        style={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
        }}
      >
        {/* Sezione Hero (non inclusa nei bullets) */}
        <section
          id="hero"
          style={{
            height: '100vh',
            scrollSnapAlign: 'start',
          }}
        >
          {heroChild}
        </section>

        {/* Sezioni scaffali: solo queste hanno bullet */}
        {shelfChildren.map((child, idx) => (
          <section
            key={`scaffale-${idx + 1}`}
            id={`scaffale-${idx + 1}`}
            style={{
              height: '100vh',
              scrollSnapAlign: 'start',
            }}
          >
            {child}
          </section>
        ))}
      </main>
    </div>
  )
}
