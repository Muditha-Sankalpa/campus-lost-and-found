import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "../../styles/admin/ManageAnnouncements.css";
import "../../styles/admin/AdminPage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function ManageAnnouncements() {
  const { token } = useContext(AuthContext);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null = creating new, object = editing existing
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    body: "",
    type: "info",
    isPublished: true,
    expiresAt: "",
  });

  // Fetch announcements on mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/announcements/admin`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setAnnouncements(data.announcements || []);
      } else {
        setError(data.message || "Failed to load announcements");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", body: "", type: "info", isPublished: true, expiresAt: "" });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (a) => {
    setEditing(a);
    setForm({
      title: a.title,
      body: a.body,
      type: a.type,
      isPublished: a.isPublished,
      expiresAt: a.expiresAt ? a.expiresAt.slice(0, 16) : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      body: form.body,
      type: form.type,
      isPublished: form.isPublished,
      expiresAt: form.expiresAt || null,
    };

    try {
      const url = editing
        ? `${API_BASE}/api/announcements/admin/${editing._id}`
        : `${API_BASE}/api/announcements/admin`;
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        fetchAnnouncements();
      } else {
        const data = await res.json();
        setError(data.message || "Save failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement? This cannot be undone.")) return;

    try {
      const res = await fetch(`${API_BASE}/api/announcements/admin/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) fetchAnnouncements();
      else {
        const data = await res.json();
        setError(data.message || "Delete failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Announcements</h1>
          <p className="admin-page__subtitle">
            Broadcast messages to all UniFind users. Active announcements appear on the homepage.
          </p>
        </div>
        {!showForm && (
          <button
            className="ma-btn ma-btn--primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + New Announcement
          </button>
        )}
      </header>

      {error && <div className="ma-error">{error}</div>}

      {showForm && (
        <form className="ma-form" onSubmit={handleSubmit}>
          <h2 className="ma-form__title">
            {editing ? "Edit Announcement" : "New Announcement"}
          </h2>

          <div className="ma-form__group">
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              maxLength={120}
              placeholder="Short, clear headline"
            />
          </div>

          <div className="ma-form__group">
            <label>Message</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
              maxLength={1000}
              rows={4}
              placeholder="What do students need to know?"
            />
          </div>

          <div className="ma-form__row">
            <div className="ma-form__group">
              <label>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="ma-form__group">
              <label>Expires at (optional)</label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </div>
          </div>

          <label className="ma-form__checkbox">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            <span>Published (visible to students)</span>
          </label>

          <div className="ma-form__actions">
            <button type="submit" className="ma-btn ma-btn--primary">
              {editing ? "Save changes" : "Publish"}
            </button>
            <button type="button" className="ma-btn ma-btn--ghost" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="ma-list">
        {loading ? (
          <p className="ma-empty">Loading…</p>
        ) : announcements.length === 0 ? (
          <div className="admin-page__empty">
            <p>No announcements yet.</p>
            <p className="admin-page__note">
              Create your first announcement to broadcast to all users.
            </p>
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a._id} className={`ma-card ma-card--${a.type}`}>
              <div className="ma-card__header">
                <div>
                  <h3 className="ma-card__title">{a.title}</h3>
                  <div className="ma-card__meta">
                    <span className={`ma-badge ma-badge--${a.type}`}>{a.type}</span>
                    {!a.isPublished && <span className="ma-badge ma-badge--draft">Draft</span>}
                    {a.expiresAt && new Date(a.expiresAt) < new Date() && (
                      <span className="ma-badge ma-badge--expired">Expired</span>
                    )}
                    <span className="ma-card__date">
                      {new Date(a.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="ma-card__actions">
                  <button className="ma-btn ma-btn--ghost" onClick={() => startEdit(a)}>
                    Edit
                  </button>
                  <button className="ma-btn ma-btn--danger" onClick={() => handleDelete(a._id)}>
                    Delete
                  </button>
                </div>
              </div>
              <p className="ma-card__body">{a.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageAnnouncements;