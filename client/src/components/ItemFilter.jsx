import React, { useState } from 'react';

export default function ItemFilter({ onChange }) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const apply = () => onChange({ q, category, status });

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
      <input placeholder="Search title or description" value={q} onChange={e => setQ(e.target.value)} />
      <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="">Any</option>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>
      <button onClick={apply} className="btn-primary">Apply</button>
    </div>
  );
}
