// pages/auth/admin-login.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(console.error)
  }, [])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => router.push('/'), 3000)
      return () => clearTimeout(t)
    }
  }, [error, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: 'admin' }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.message || 'Accesso negato')
      return
    }
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-800">
      {error ? (
        <div className="text-white text-5xl font-bold text-center">
          {error}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 p-8 rounded shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login Admin
          </h2>
          <label className="block mb-4">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-400 text-black"
            />
          </label>
          <label className="block mb-6 relative">
            <span className="text-gray-700">Password</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-400 text-black pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(x => !x)}
              className="absolute right-3 top-[38px] text-gray-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </label>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Accedi
          </button>
        </form>
      )}
    </div>
  )
}
