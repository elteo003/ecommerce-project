// components/AuthForm.tsx
import React, { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

interface Props {
    isRegister?: boolean
}

export default function AuthForm({ isRegister = false }: Props) {
    const { login, register } = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setError(null)
            if (isRegister) {
                await register(email, password, firstName, lastName)
            } else {
                await login(email, password)
            }
        } catch (err: any) {
            setError(err.message || 'Si è verificato un errore')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md max-w-md mx-auto">
            {isRegister && (
                <>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full mb-2 p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Cognome"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full mb-2 p-2 border rounded"
                        required
                    />
                </>
            )}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
                required
            />
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <button
                type="submit"
                className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
            >
                {isRegister ? 'Registrati' : 'Accedi'}
            </button>
        </form>
    )
}
