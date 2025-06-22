// pages/admin/index.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { FiPlus, FiMinus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext'

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  password?: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  useEffect(() => {
    axios.get('/api/auth/users').then(res => setUsers(res.data));
    axios.get('/api/product').then(res => setProducts(res.data));
  }, []);

  // --- Handlers Utenti ---
  const startEditUser = (u: User) => {
    setEditingUserId(u.id);
    setEditedUser({ ...u });
  };
  const saveUser = async () => {
    if (!editingUserId) return;
    await axios.put(`/api/auth/users/${editingUserId}`, editedUser);
    setUsers(users.map(u => u.id === editingUserId ? { ...u, ...editedUser } : u));
    setEditingUserId(null);
  };
  const deleteUser = async (id: string) => {
    await axios.delete(`/api/auth/users/${id}`);
    setUsers(users.filter(u => u.id !== id));
  };

  // --- Handlers Prodotti ---
  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setEditedProduct({ ...p });
  };
  const saveProduct = async () => {
    if (!editingProductId) return;
    await axios.put(`/api/product/${editingProductId}`, editedProduct);
    setProducts(products.map(p => p.id === editingProductId ? { ...p, ...editedProduct } : p));
    setEditingProductId(null);
  };
  const deleteProduct = async (id: string) => {
    await axios.delete(`/api/product/${id}`);
    setProducts(products.filter(p => p.id !== id));
  };

  const adjustPrice = (delta: number) => {
    setEditedProduct(prev => ({
      ...prev,
      price: Math.max(0, (prev.price ?? 0) + delta)
    }));
  };

  const handleProductField = (field: keyof Product, value: any) => {
    setEditedProduct(prev => ({ ...prev, [field]: value }));
  };
  const handleUserField = (field: keyof User, value: any) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen overflow-y-auto px-6 py-10 bg-gradient-to-br from-red-800 to-red-900 text-white font-sans">
      <h1 className="text-4xl font-bold mb-10 text-center">Admin Panel</h1>

      {/* UTENTI */}
      <section className="mb-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Utenti</h2>
        <ul className="space-y-4">
          {users.map(u => (
            <li key={u.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4">
              {editingUserId === u.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder={`Nome: ${u.firstName || 'mancante'}`}
                    value={editedUser.firstName ?? ''}
                    onChange={e => handleUserField('firstName', e.target.value)}
                    className="w-full bg-transparent border-b border-white p-2 placeholder-white/60"
                  />
                  <input
                    type="text"
                    placeholder={`Cognome: ${u.lastName || 'mancante'}`}
                    value={editedUser.lastName ?? ''}
                    onChange={e => handleUserField('lastName', e.target.value)}
                    className="w-full bg-transparent border-b border-white p-2 placeholder-white/60"
                  />
                  <input
                    type="email"
                    placeholder={`Email: ${u.email}`}
                    value={editedUser.email ?? ''}
                    onChange={e => handleUserField('email', e.target.value)}
                    className="w-full bg-transparent border-b border-white p-2 placeholder-white/60"
                  />
                  <input
                    type="text"
                    placeholder={`Ruolo: ${u.role}`}
                    value={editedUser.role ?? ''}
                    onChange={e => handleUserField('role', e.target.value)}
                    className="w-full bg-transparent border-b border-white p-2 placeholder-white/60"
                  />
                  <input
                    type="password"
                    placeholder="Password: ********"
                    value={editedUser.password ?? ''}
                    onChange={e => handleUserField('password', e.target.value)}
                    className="w-full bg-transparent border-b border-white p-2 placeholder-white/60"
                  />
                  <div className="flex space-x-4">
                    <button onClick={saveUser} className="text-green-300 hover:text-green-100"><FiEdit2 /> Salva</button>
                    <button onClick={() => setEditingUserId(null)} className="text-gray-300 hover:text-white">Annulla</button>
                    <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-200"><FiTrash2 /> Elimina</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg">{u.email}</p>
                    <p className="text-sm text-gray-300">{u.role}</p>
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={() => startEditUser(u)} className="hover:text-blue-200"><FiEdit2 /> Modifica</button>
                    <button onClick={() => deleteUser(u.id)} className="hover:text-red-200"><FiTrash2 /> Elimina</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* PRODOTTI */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Prodotti</h2>
        <ul className="space-y-4">
          {products.map(p => (
            <li key={p.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4">
              {editingProductId === p.id ? (
                <>
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      placeholder={`Nome: ${p.name}`}
                      value={editedProduct.name ?? ''}
                      onChange={e => handleProductField('name', e.target.value)}
                      className="w-2/3 bg-transparent border-b border-white p-2 placeholder-white/60"
                    />
                    <div className="flex space-x-4">
                      <button onClick={saveProduct} className="text-green-300 hover:text-green-100"><FiEdit2 /> Salva</button>
                      <button onClick={() => setEditingProductId(null)} className="text-gray-300 hover:text-white">Annulla</button>
                      <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-200"><FiTrash2 /> Elimina</button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-4">
                    <textarea
                      placeholder={p.description ?? 'Descrizione mancante'}
                      value={editedProduct.description ?? ''}
                      onChange={e => handleProductField('description', e.target.value)}
                      className="w-full bg-transparent border border-white p-2 rounded placeholder-white/60"
                    />
                    <div className="flex items-center gap-2">
                      <button onClick={() => adjustPrice(-1)} className="text-xl hover:text-red-400"><FiMinus /></button>
                      <input
                        type="number"
                        value={editedProduct.price ?? p.price ?? 0}
                        onChange={e => handleProductField('price', parseFloat(e.target.value))}
                        className="w-24 bg-transparent border border-white p-2 rounded text-center"
                      />
                      <button onClick={() => adjustPrice(1)} className="text-xl hover:text-green-400"><FiPlus /></button>
                    </div>
                    <input
                      type="text"
                      placeholder={p.imageUrl ?? 'mancante'}
                      value={editedProduct.imageUrl ?? ''}
                      onChange={e => handleProductField('imageUrl', e.target.value)}
                      className="w-full bg-transparent border border-white p-2 rounded placeholder-white/60"
                    />
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <div>
                    <p className="text-lg">{p.name}</p>
                    <p className="text-sm text-gray-300">{p.description}</p>
                    <p className="mt-1">
                      €{(p.price != null ? p.price.toFixed(2) : '0.00')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button onClick={() => startEditProduct(p)} className="hover:text-blue-200"><FiEdit2 /> Modifica</button>
                    <button onClick={() => deleteProduct(p.id)} className="hover:text-red-200"><FiTrash2 /> Elimina</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
