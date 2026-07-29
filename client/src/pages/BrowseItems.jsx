import React, { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import ItemFilter from '../components/ItemFilter';
import '../styles/Auth.css';

export default function BrowseItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (filters = {}) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category) params.set('category', filters.category);
    if (filters.location) params.set('location', filters.location);
    if (filters.status) params.set('status', filters.status);

    const endpoint = params.toString() ? '/api/items/search?' + params.toString() : '/api/items';
    const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + endpoint);
    const data = await res.json();
    if (res.ok) setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-shell">
      <div className="panel panel--wide">
        <div className="panel__header">
          <div>
            <h2>Browse items</h2>
            <p>Search campus reports by title, category, location, or status.</p>
          </div>
        </div>
        <ItemFilter onChange={(filters) => load(filters)} />
        {loading ? <p className="empty-state">Loading items…</p> : items.length === 0 ? (
          <div className="empty-state">No items match the current filters yet.</div>
        ) : (
          <div className="browse-grid">
            {items.map((item) => <ItemCard key={item._id} item={item} onClaim={item => item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
