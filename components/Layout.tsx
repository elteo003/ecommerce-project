// components/Layout.tsx
import React, { ReactNode, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import SidebarMenu from './ui/SidebarMenu'
import ScrollNav from './ui/ScrollNav'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const isAdminRoute = router.pathname.startsWith('/admin')

  // separa hero + scaffali
  const all = React.Children.toArray(children)
  const hero = all[0]
  const shelves = all.slice(1)

  // liste di ID
  const sectionIds = ['hero', ...shelves.map((_, i) => `scaffale-${i + 1}`)]

  // ScrollNav mostra solo sugli scaffali, no hero, no admin, no login
  const showScrollNav =
    !isAdminRoute &&
    sectionIds.length > 1 &&
    !router.pathname.startsWith('/auth/login')

  // ref al main scrollabile
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = mainRef.current
    if (!container) return

    // precompute positions
    const positions = sectionIds.map(id => {
      const el = document.getElementById(id)!
      return el.offsetTop
    })

    let ticking = false
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (ticking) return
      ticking = true

      const dir = e.deltaY > 0 ? 1 : -1
      const currentScroll = container.scrollTop

      // trova indice della sezione più vicina
      let closestIdx = 0
      let minDiff = Infinity
      positions.forEach((pos, idx) => {
        const diff = Math.abs(currentScroll - pos)
        if (diff < minDiff) {
          minDiff = diff
          closestIdx = idx
        }
      })

      const nextIdx = Math.min(Math.max(closestIdx + dir, 0), positions.length - 1)

      container.scrollTo({
        top: positions[nextIdx],
        behavior: 'smooth',
      })

      // libera dopo durata scroll
      setTimeout(() => (ticking = false), 600)
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', onWheel)
    }
  }, [sectionIds])

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

      {/* SidebarMenu: se admin, forza guest */}
      <SidebarMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isAuthenticated={isAdminRoute ? false : isAuthenticated}
        isArtisan={false}
        isAdmin={false}
      />

      {/* pallini sulla destra per gli scaffali */}
      {showScrollNav && <ScrollNav sectionIds={sectionIds.slice(1)} />}

      {/* contenuto scrollabile */}
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
      >
        <section id="hero" className="h-screen">
          {hero}
        </section>
        {shelves.map((child, idx) => (
          <section
            key={idx}
            id={`scaffale-${idx + 1}`}
            className="h-screen"
          >
            {child}
          </section>
        ))}
      </main>
    </div>
  )
}
