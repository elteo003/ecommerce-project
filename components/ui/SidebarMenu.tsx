// components/ui/SidebarMenu.tsx
'use client';

import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../contexts/AuthContext';

interface SidebarMenuProps {
    open: boolean;
    onClose: () => void;
}

export default function SidebarMenu({ open, onClose }: SidebarMenuProps) {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const isArtisan = user?.role.toUpperCase() === 'ARTISAN';

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
                <button
                    onClick={onClose}
                    aria-label="Chiudi menu"
                    style={{ background: 'none', border: 'none', fontSize: '2rem', color: '#fff', padding: '1rem', cursor: 'pointer' }}
                >
                    ×
                </button>

                <nav style={{ padding: '1rem' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '1.25rem' }}>
                        <li style={{ margin: '1rem 0' }}>
                            <button onClick={() => navigateAndClose('/')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                                Home
                            </button>
                        </li>

                        {!isAuthenticated && (
                            <>
                                <li style={{ margin: '1rem 0' }}>
                                    <button onClick={() => navigateAndClose('/login')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                                        Accedi
                                    </button>
                                </li>
                                <li style={{ margin: '1rem 0' }}>
                                    <button onClick={() => navigateAndClose('/register')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                                        Registrati
                                    </button>
                                </li>
                                <li style={{ margin: '1rem 0' }}>
                                    <button onClick={() => navigateAndClose('/auth/artisan-login')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                                        Login Artigiani
                                    </button>
                                </li>
                            </>
                        )}

                        {isAuthenticated && (
                            <>
                                {!isArtisan && (
                                    <li style={{ margin: '1rem 0' }}>
                                        <button onClick={() => navigateAndClose('/cart')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                                            Carrello
                                        </button>
                                    </li>
                                )}
                                {isArtisan && (
                                    <li style={{ margin: '1rem 0' }}>
                                        <button onClick={() => navigateAndClose('/dashboard')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                                            Dashboard Artigiani
                                        </button>
                                    </li>
                                )}
                                <li style={{ margin: '1rem 0' }}>
                                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </aside>
        </>
    );
}
