// pages/auth/artisan-login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function ArtisanLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: 'artisan' }),
    });
    if (res.ok) {
      // Forza il redirect completo a /dashboard
      window.location.href = '/dashboard';
    } else {
      const { message } = await res.json();
      setError(message || 'Login fallito');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700 px-4">
        <div className="w-full max-w-sm bg-white bg-opacity-90 p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-black text-center mb-6">Accedi Artigiani</h1>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400 pr-10 text-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
                tabIndex={-1}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
            >
              Accedi
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
