import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ItemForm({ onSuccess }) {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('lost');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Categories loaded from admin-managed list
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`);
        const data = await res.json();
        if (res.ok) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleFiles = (event) => setImages(Array.from(event.target.files));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('category', category);
      form.append('location', location);
      form.append('status', status);
      images.forEach((file) => form.append('images', file));

      const res = await fetch(`${API_BASE}/api/items`, {
        method: 'POST',
        headers: token ? { Authorization: 'Bearer ' + token } : {},
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Your report has been submitted and is waiting for moderation.');
        onSuccess && onSuccess(data.item);
        setTitle('');
        setDescription('');
        setCategory('');
        setLocation('');
        setStatus('lost');
        setImages([]);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label>Title</label>
        <input value={title} onChange={(event) => setTitle(event.target.value)} required />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} required rows={4} />
      </div>

      <div className="form-group">
        <label>Category</label>
        {categoriesLoading ? (
          <select disabled>
            <option>Loading categories…</option>
          </select>
        ) : categories.length === 0 ? (
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="e.g. ID Card, Wallet"
          />
        ) : (
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.icon ? `${cat.icon} ${cat.name}` : cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="form-group">
        <label>Location</label>
        <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Library, Sports Centre" />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </div>

      <div className="form-group">
        <label>Images (optional)</label>
        <input type="file" multiple accept="image/*" onChange={handleFiles} />
      </div>

      {error && <div className="form__error">{error}</div>}
      {success && <div className="form__message">{success}</div>}

      <div className="auth-actions">
        <button className="btn-primary" type="submit">Submit report</button>
      </div>
    </form>
  );
}