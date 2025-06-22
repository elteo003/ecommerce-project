// contexts/AuthContext.tsx
import React, {
  createContext, useState, useEffect, ReactNode, useContext,
} from 'react'
import { useRouter } from 'next/router'

export interface AuthContextType {
  user: null | {
    email: string
    role: string
    firstName: string
    lastName: string
  }
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, role?: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string, role?: string) => Promise<void>
  logout: () => Promise<void>
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { throw new Error('AuthProvider non inizializzato') },
  register: async () => { throw new Error('AuthProvider non inizializzato') },
  logout: async () => { throw new Error('AuthProvider non inizializzato') },
}

export const AuthContext = createContext<AuthContextType>(defaultContext)
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        const u = data.user ?? data
        setUser({
          email: u.email,
          role: u.role,
          firstName: u.firstName,
          lastName: u.lastName,
        })
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const login = async (
    email: string,
    password: string,
    role?: string
  ) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    })
    if (!res.ok) {
      const t = await res.text()
      throw new Error('Login fallito: ' + t)
    }

    if (role === 'admin') {
      // admin-session: non popolo user, vado su /admin
      router.replace('/admin')
      return
    }

    // utente normale: rifetcho /me
    try {
      const me = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      })
      if (me.ok) {
        const d = await me.json()
        const u = d.user ?? d
        setUser({
          email: u.email,
          role: u.role,
          firstName: u.firstName,
          lastName: u.lastName,
        })
      }
    } catch {}
    router.replace('/')
  }

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: string
  ) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName, role }),
    })
    if (!res.ok) {
      const t = await res.text()
      throw new Error('Registrazione fallita: ' + t)
    }
    const data = await res.json()
    setUser({
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    })
    router.replace('/')
  }

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(console.error)
    setUser(null)
    router.replace('/auth/login')
  }

  const isAuthenticated = !!user && !isLoading

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
