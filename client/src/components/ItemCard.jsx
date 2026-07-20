import React from 'react';
import '../styles/Auth.css';

export default function ItemCard({ item }) {
  const date = new Date(item.createdAt).toLocaleString();
  return (
    <div style={{ border: '1px solid var(--color-grey-100)', borderRadius: 12, padding: 12, background: 'white' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 120, height: 90, background: 'var(--color-grey-100)', borderRadius: 8, overflow: 'hidden' }}>
          {item.images && item.images[0] ? (
            <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ padding: 8, color: 'var(--color-grey-600)' }}>No image</div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>{item.title}</h3>
          <p style={{ margin: '6px 0', color: 'var(--color-grey-600)' }}>{item.description}</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--color-grey-600)' }}>{item.location}</span>
            <span style={{ fontSize: 12, color: 'var(--color-grey-600)' }}>{item.category}</span>
            <span style={{ fontSize: 12, color: 'var(--color-grey-600)' }}>{date}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, color: item.status === 'lost' ? 'var(--color-purple-700)' : 'var(--color-gold)' }}>{item.status}</div>
          <div style={{ fontSize: 12, color: item.moderationStatus === 'approved' ? 'green' : 'orange' }}>{item.moderationStatus}</div>
        </div>
      </div>
    </div>
  );
}
