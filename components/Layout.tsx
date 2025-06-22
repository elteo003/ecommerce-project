// components/Layout.tsx
import React, { ReactNode, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import SidebarMenu from './ui/SidebarMenu'
import ScrollNav from './ui/ScrollNav'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  // distinzione admin vs frontend
  const isAdminRoute = router.pathname.startsWith('/admin')

  // Hero + scaffali
  const sections = React.Children.toArray(children)
  const hero = sections[0]
  const shelves = sections.slice(1)
  const sectionIds = shelves.map((_, i) => `scaffale-${i + 1}`)

  // mostro pallini solo su frontend
  const showScrollNav =
    !isAdminRoute &&
    sectionIds.length > 0 &&
    !router.pathname.startsWith('/auth/login')

  return (
    <div className="layout relative flex flex-col h-screen overflow-hidden">
      {/* hamburger */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        className="fixed top-4 right-4 z-50 p-2 bg-transparent hover:bg-white/10 rounded-lg"
        aria-label="Apri menu"
      >
        <img src="/img/hamburger.png" alt="Menu" width={28} height={28} />
      </button>

      {/* Sidebar: 
          – se /admin, forza come ospite => isAuthenticated={false}
          – altrimenti usa il vero stato */}
      <SidebarMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isAuthenticated={isAdminRoute ? false : isAuthenticated}
        isArtisan={false}
        isAdmin={false}
      />

      {showScrollNav && <ScrollNav sectionIds={sectionIds} />}

      <main
        className={
          // se /admin → scroll normale
          isAdminRoute
            ? 'flex-1 overflow-y-auto scrollbar-hide'
            : 'mt-0 flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory pt-0'
        }
      >
        <section id="hero" className="h-screen snap-start">
          {hero}
        </section>
        {shelves.map((child, idx) => (
          <section
            key={idx}
            id={`scaffale-${idx + 1}`}
            className={isAdminRoute ? '' : 'h-screen snap-start'}
          >
            {child}
          </section>
        ))}
      </main>
    </div>
  )
}
