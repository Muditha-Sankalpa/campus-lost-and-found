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
<<<<<<< HEAD
    <form onSubmit={handleSubmit} className="card">
      <div>
        <label>Title</label><br />
        <input type="text" name="title" value={form.title} onChange={handleChange} required style={{ width: "100%" }} />
      </div>
      <div>
        <label>Description</label><br />
        <textarea name="description" value={form.description} onChange={handleChange} required rows={3} style={{ width: "100%" }} />
      </div>
      <div>
        <label>Category</label><br />
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Status</label><br />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
          <option value="recovered">Recovered</option>
        </select>
      </div>
      <div>
        <label>Location</label><br />
        <input type="text" name="location" value={form.location} onChange={handleChange} required style={{ width: "100%" }} />
      </div>
      <div>
        <label>Contact Info (optional)</label><br />
        <input type="text" name="contactInfo" value={form.contactInfo} onChange={handleChange} style={{ width: "100%" }} />
      </div>
      <div>
        <label>Images (up to 5)</label><br />
        <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      </div>

      <div style={{ marginTop: 10 }}>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : initialItem ? "Update Item" : "Submit Report"}
        </button>{" "}
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>

      {message && <p style={{ marginTop: 8 }}>{message}</p>}
    </form>
  );
};

export default ItemForm;
=======
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
>>>>>>> 0f5319464deeba7e8ce7e7fd4d9127558b108fc9
