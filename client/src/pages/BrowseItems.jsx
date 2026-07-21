import React, { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import ItemFilter from '../components/ItemFilter';
import '../styles/Auth.css';

export default function BrowseItems() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({});

  const load = async (f = {}) => {
    const params = new URLSearchParams();
    if (f.q) params.set('q', f.q);
    if (f.category) params.set('category', f.category);
    if (f.status) params.set('status', f.status);
    // default moderationStatus=approved on backend
    const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/items?' + params.toString());
    const data = await res.json();
    if (res.ok) setItems(data.items || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Browse items</h2>
      <ItemFilter onChange={(f) => { setFilters(f); load(f); }} />
      <div className="browse-grid">
        {items.map(it => <ItemCard key={it._id} item={it} />)}
      </div>
    </div>
  );
}
