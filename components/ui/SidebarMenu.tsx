'use client';

import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../contexts/AuthContext';

interface SidebarMenuProps {
    open: boolean;
    onClose: () => void;
    isAuthenticated: boolean;
    isArtisan: boolean;
}

export default function SidebarMenu({
    open,
    onClose,
    isAuthenticated,
    isArtisan,
}: SidebarMenuProps) {
    const router = useRouter();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const handleLogout = async () => {
        await logout();
        onClose();
        router.push('/');
    };

    const navigateAndClose = (path: string) => {
        onClose();
        router.push(path);
    };

    return (
        <>
            {open && (
                <div
                    onClick={onClose}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900, cursor: 'pointer' }}
                />
            )}
            <aside
                role="dialog"
                aria-modal="true"
                aria-hidden={!open}
                style={{
                    position: 'fixed', top: 0, right: 0, height: '100vh', width: '80vw', maxWidth: '300px',
                    background: '#000', color: '#fff', zIndex: 1000,
                    transform: open ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease-in-out', pointerEvents: open ? 'auto' : 'none'
                }}
            >
                <button onClick={onClose} aria-label="Chiudi menu" style={{/* … */ }}>×</button>
                <nav style={{ padding: '1rem' }}>
                    <ul style={{/* … */ }}>
                        <li>
                            <button onClick={() => navigateAndClose('/')}>Home</button>
                        </li>

                        {!isAuthenticated ? (
                            <>
                                <li>
                                    <button
                                        onClick={() => navigateAndClose('/auth/login')}
                                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                                    >
                                        Accedi
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => navigateAndClose('/auth/register')}
                                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                                    >
                                        Registrati
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => navigateAndClose('/auth/artisan-login')}
                                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                                    >
                                        Login Artigiani
                                    </button>
                                </li>

                            </>
                        ) : (
                            <>
                                {!isArtisan ? (
                                    <li><button onClick={() => navigateAndClose('/cart')}>Carrello</button></li>
                                ) : (
                                    <li><button onClick={() => navigateAndClose('/dashboard')}>Dashboard Artigiani</button></li>
                                )}
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </>
                        )}
                    </ul>
                </nav>
            </aside>
        </>
    );
}
