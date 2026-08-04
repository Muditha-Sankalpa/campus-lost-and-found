import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import ItemCard from '../components/ItemCard';
import '../styles/Auth.css';

export default function MyItems() {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);

  const load = async (tab = activeTab) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (tab !== 'all') {
      if (tab === 'recovered') params.set('moderation', 'recovered');
      else params.set('moderation', tab);
    }

    const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/items/my/list?' + params.toString(), {
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });
    const data = await res.json();
    if (res.ok) setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load(activeTab);
  }, [activeTab]);

  const handleRecover = async (itemId) => {
    const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + `/api/items/${itemId}`, {
      method: 'PUT',
      headers: token ? { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'recovered', moderationStatus: 'approved' })
    });
    if (res.ok) load(activeTab);
  };

  const handleDelete = async (itemId) => {
    const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + `/api/items/${itemId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });
    if (res.ok) load(activeTab);
  };

  return (
    <div className="page-shell">
      <div className="panel panel--wide">
        <div className="panel__header">
          <div>
            <h2>My reports</h2>
            <p>Track your submissions, review moderation status, and update recovered items.</p>
          </div>
        </div>

        <div className="pill-group" role="tablist" aria-label="Report filters">
          {['all', 'pending', 'approved', 'rejected', 'recovered'].map((tab) => (
            <button
              key={tab}
              className={`pill ${activeTab === tab ? 'pill--active' : ''}`}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab === 'all' ? 'All reports' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? <p className="empty-state">Loading your reports…</p> : items.length === 0 ? (
          <div className="empty-state">You have no reports in this category yet.</div>
        ) : (
          <div className="browse-grid">
            {items.map((item) => <ItemCard key={item._id} item={item} onRecover={handleRecover} onDelete={handleDelete} />)}
          </div>
        )}
      </div>
    </div>
  );
}
