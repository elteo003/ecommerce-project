// pages/register.tsx
import { GetServerSideProps } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { getPayloadFromReq } from '../utils/auth';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string>('');
  const [role, setRole] = useState<'user' | 'artisan'>('user');

  // Validation flags
  const [hasUpper, setHasUpper] = useState(false);
  const [hasLower, setHasLower] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);
  const [hasLength, setHasLength] = useState(false);

  useEffect(() => {
    setHasUpper(/[A-Z]/.test(password));
    setHasLower(/[a-z]/.test(password));
    setHasNumber(/\d/.test(password));
    setHasSpecial(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    setHasLength(password.length >= 10);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors('');
    if (password !== confirm) {
      setErrors('Le password non corrispondono.');
      return;
    }
    if (!(hasUpper && hasLower && hasNumber && hasSpecial && hasLength)) {
      setErrors('La password non soddisfa tutti i requisiti.');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, role }),
    });
    if (res.ok) {
      router.push('/login');
    } else {
      const { message } = await res.json();
      setErrors(message || 'Registrazione fallita');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700 px-4">
        <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-xl shadow-lg relative">
          <h1 className="text-2xl font-bold text-black text-center mb-6">Registrati</h1>
          {errors && <p className="text-red-600 text-center mb-4">{errors}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Cognome</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400  text-black"
              />
            </div>
            {/* Password field with eye toggle */}
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
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            {/* Confirm Password field with eye toggle */}
            <div className="relative">
              <label className="block text-gray-700 mb-1">Conferma Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400 pr-10 text-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            {/* Checklist requisiti */}
            <ul className="text-sm space-y-1">
              {[
                { ok: hasUpper, text: 'Almeno una lettera maiuscola' },
                { ok: hasLower, text: 'Almeno una lettera minuscola' },
                { ok: hasNumber, text: 'Almeno un numero' },
                { ok: hasSpecial, text: 'Almeno un carattere speciale' },
                { ok: hasLength, text: 'Minimo 10 caratteri' },
              ].map((r, i) => (
                <li key={i} className="flex items-center">
                  <span className={`inline-block w-3 h-3 mr-2 rounded-full ${r.ok ? 'bg-green-500' : 'bg-gray-300'}`} />
                  {r.text}
                </li>
              ))}
            </ul>

            {/* Checkbox Artigiano */}
            <div className="flex items-center">
              <input
                id="artisan"
                type="checkbox"
                checked={role === 'artisan'}
                onChange={e => setRole(e.target.checked ? 'artisan' : 'user')}
                className="mr-2"
              />
              <label htmlFor="artisan" className="text-gray-700 select-none">
                Registrami come artigiano
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition mt-4"
            >
              Registrati
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const payload = getPayloadFromReq(req as any);
  if (payload) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: {} };
};
