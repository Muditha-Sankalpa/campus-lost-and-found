import React, { useState } from 'react';

export default function ItemFilter({ onChange }) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');

  const apply = () => onChange({ q, category, location, status });

  return (
    <div className="filter-bar">
      <input placeholder="Search by title, description, or location" value={q} onChange={(event) => setQ(event.target.value)} />
      <input placeholder="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
      <input placeholder="Location" value={location} onChange={(event) => setLocation(event.target.value)} />
      <select value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="">Any status</option>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
        <option value="recovered">Recovered</option>
      </select>
      <button onClick={apply} className="btn-primary">Apply</button>
    </div>
  );
}
