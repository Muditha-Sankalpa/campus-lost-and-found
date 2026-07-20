import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import ItemCard from '../components/ItemCard';

export default function MyItems() {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  const load = async () => {
    const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/items/my/list', {
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });
    const data = await res.json();
    if (res.ok) setItems(data.items || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>My reports</h2>
      {items.length === 0 && <p style={{ color: 'var(--color-grey-600)' }}>You haven't reported any items yet.</p>}
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map(it => <ItemCard key={it._id} item={it} />)}
      </div>
    </div>
  );
}
