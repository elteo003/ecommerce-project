import Link from 'next/link';

export default function Sidebar({ open, setOpen, isAuthenticated, isAdmin }: any) {
  return (
    <div className={`fixed top-0 right-0 h-full w-64 bg-black transition-transform duration-300 transform ${open ? 'translate-x-0' :'translate-x-full' } z-40`}>
      <div className="p-6 flex flex-col gap-4">
        <Link href="/" onClick={() => setOpen(false)} className="text-white">Home</Link>
        {!isAuthenticated && <Link href="/login" onClick={() => setOpen(false)} className="text-white">Login</Link>}
        {!isAuthenticated && <Link href="/register" onClick={() => setOpen(false)} className="text-white">Register</Link>}
        {isAuthenticated && <Link href="/cart" onClick={() => setOpen(false)} className="text-white">Carrello</Link>}
        {isAdmin && <Link href="/admin" onClick={() => setOpen(false)} className="text-white">Admin</Link>}
      </div>
    </div>
  );
}
