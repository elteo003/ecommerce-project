import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

export default function Admin() {
  const { isAdmin } = useContext(AuthContext);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) {
      axios.get('/api/auth/users').then(res => setUsers(res.data));
      axios.get('/api/products').then(res => setProducts(res.data));
    }
  }, [isAdmin]);

  if (!isAdmin) return <p className="text-white p-4">Accesso negato.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Admin Panel</h1>
      <h2 className="text-xl mt-4">Utenti</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} className="flex justify-between">
            <span>{user.email} ({user.role})</span>
            <div>
              <button className="text-blue-500 mr-2">Modifica</button>
              <button className="text-red-500">Elimina</button>
            </div>
          </li>
        ))}
      </ul>
      <h2 className="text-xl mt-4">Prodotti</h2>
      <ul>
        {products.map(product => (
          <li key={product.id} className="flex justify-between">
            <span>{product.name} - {product.collection}</span>
            <div>
              <button className="text-blue-500 mr-2">Modifica</button>
              <button className="text-red-500">Elimina</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
