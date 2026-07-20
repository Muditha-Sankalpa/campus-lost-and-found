import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthProvider';

export default function ItemForm({ onSuccess }) {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('lost');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const handleFiles = (e) => setImages(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('category', category);
      form.append('location', location);
      form.append('status', status);
      images.forEach((f) => form.append('images', f));

      const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/items', {
        method: 'POST',
        headers: token ? { Authorization: 'Bearer ' + token } : {},
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess && onSuccess(data.item);
        setTitle(''); setDescription(''); setCategory(''); setLocation(''); setImages([]);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={{ gap: 10 }}>
      <div className="form-group">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Category</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </div>
      <div className="form-group">
        <label>Images (optional)</label>
        <input type="file" multiple accept="image/*" onChange={handleFiles} />
      </div>
      {error && <div className="form__error">{error}</div>}
      <div className="auth-actions">
        <button className="btn-primary" type="submit">Submit report</button>
      </div>
    </form>
  );
}
