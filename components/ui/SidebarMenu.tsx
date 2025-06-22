'use client';

import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FiHome, FiLogIn, FiUserPlus, FiLogOut, FiShoppingCart, FiSettings, FiTool, FiShield } from 'react-icons/fi';
import { AuthContext } from '../../contexts/AuthContext';

interface SidebarMenuProps {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  isArtisan: boolean;
  isAdmin: boolean;
}

export default function SidebarMenu({
  open,
  onClose,
  isAuthenticated,
  isArtisan,
  isAdmin,
}: SidebarMenuProps) {
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (open) document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const handleLogout = async () => {
    await logout();
    onClose();
    router.push('/');
  };

  const navigateAndClose = (path: string) => {
    onClose();
    router.push(path);
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: <FiHome /> },
    ...(!isAuthenticated
      ? [
          { label: 'Accedi', path: '/auth/login', icon: <FiLogIn /> },
          { label: 'Registrati', path: '/auth/register', icon: <FiUserPlus /> },
          { label: 'Login Artigiani', path: '/auth/artisan-login', icon: <FiTool /> },
          { label: 'Login Admin', path: '/auth/admin-login', icon: <FiShield /> },
        ]
      : [
          ...(isAdmin
            ? [{ label: 'Pannello Admin', path: '/admin', icon: <FiShield /> }]
            : isArtisan
            ? [{ label: 'Dashboard Artigiani', path: '/dashboard', icon: <FiSettings /> }]
            : [{ label: 'Carrello', path: '/cart', icon: <FiShoppingCart /> }]),

          { label: 'Logout', action: handleLogout, icon: <FiLogOut /> },
        ]),
  ];

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 900,
    cursor: 'pointer',
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    width: '80vw',
    maxWidth: '300px',
    background: '#000',
    color: '#fff',
    zIndex: 1000,
    transform: open ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out',
    pointerEvents: open ? 'auto' : 'none',
    overflowY: 'auto',
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    width: '100%',
    padding: '0.75rem 0',
    fontSize: '1rem',
    textAlign: 'left',
  };

  return (
    <>
      {open && <div onClick={onClose} style={overlayStyle} />}
      <aside role="dialog" aria-modal="true" style={sidebarStyle}>
        <button
          onClick={onClose}
          aria-label="Chiudi menu"
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '2rem',
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
        <nav style={{ padding: '1rem', paddingTop: '3rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={
                    item.action
                      ? item.action
                      : () => navigateAndClose(item.path as string)
                  }
                  style={buttonStyle}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
