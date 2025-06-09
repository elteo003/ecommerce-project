// components/ui/HeroSection.tsx
import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

export default function HeroSection() {
    const { user, isAuthenticated } = useContext(AuthContext)

    return (
        <section
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                backgroundImage: "url('/hero-vasi.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {isAuthenticated && user && (
                <div
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        left: '1.5rem',
                        color: '#fff',
                        fontStyle: 'italic',
                        fontSize: '1.25rem',
                        textShadow: '0 0 6px rgba(0,0,0,0.7)',
                    }}
                >
                    Ben tornato, {user.firstName} {user.lastName}!
                </div>
            )}
            <h1
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    fontStyle: 'italic',
                    transform: 'translate(-50%, -50%)',
                    color: '#fff',
                    textShadow: '0 0 8px rgba(0,0,0,0.7)',
                    fontSize: '3rem',
                    margin: 0,
                }}
            >
                L' eleganza che prende forma
            </h1>
        </section>
    )
}
