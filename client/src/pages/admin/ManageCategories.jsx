import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "../../styles/admin/ManageCategories.css";
import "../../styles/admin/AdminPage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Suggested icon options - just simple emojis, admin can type any
const ICON_SUGGESTIONS = ["📱", "💻", "📚", "🎒", "🔑", "🥤", "🧥", "🕶", "☂", "🎧", "⌚", "💳"];

function ManageCategories() {
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("active"); // active | inactive | all

  const [form, setForm] = useState({ name: "", description: "", icon: "" });

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/categories/admin`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) setCategories(data.categories || []);
      else setError(data.message || "Failed to load categories");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", description: "", icon: "" });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description || "",
      icon: cat.icon || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      name: form.name,
      description: form.description,
      icon: form.icon,
    };
    try {
      const url = editing
        ? `${API_BASE}/api/categories/admin/${editing._id}`
        : `${API_BASE}/api/categories/admin`;
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        resetForm();
        fetchCategories();
      } else {
        setError(data.message || "Save failed");
      }
    } catch {
      setError("Network error");
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      const res = await fetch(`${API_BASE}/api/categories/admin/${cat._id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c._id === cat._id ? data.category : c))
        );
      } else {
        setError(data.message || "Failed to update");
      }
    } catch {
      setError("Network error");
    }
  };

  const handleSoftDelete = async (cat) => {
    if (!window.confirm(`Deactivate "${cat.name}"? Existing items keep their category, but no new items can select it.`))
      return;
    try {
      const res = await fetch(`${API_BASE}/api/categories/admin/${cat._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c._id === cat._id ? data.category : c))
        );
      } else {
        setError(data.message || "Failed to deactivate");
      }
    } catch {
      setError("Network error");
    }
  };

  const handleHardDelete = async (cat) => {
    if (
      !window.confirm(
        `PERMANENTLY delete "${cat.name}"? This cannot be undone and may break existing items referencing it.`
      )
    )
      return;
    try {
      const res = await fetch(
        `${API_BASE}/api/categories/admin/${cat._id}/permanent`,
        { method: "DELETE", headers: authHeaders() }
      );
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== cat._id));
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete");
      }
    } catch {
      setError("Network error");
    }
  };

  const filtered = categories.filter((c) => {
    if (filter === "active") return c.isActive;
    if (filter === "inactive") return !c.isActive;
    return true;
  });

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Manage Categories</h1>
          <p className="admin-page__subtitle">
            Categories students pick when reporting lost or found items. {categories.length} total.
          </p>
        </div>
        {!showForm && (
          <button
            className="mc-btn mc-btn--primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + New Category
          </button>
        )}
      </header>

      {error && <div className="mc-error">{error}</div>}

      {showForm && (
        <form className="mc-form" onSubmit={handleSubmit}>
          <h2 className="mc-form__title">
            {editing ? "Edit Category" : "New Category"}
          </h2>

          <div className="mc-form__row">
            <div className="mc-form__group mc-form__group--icon">
              <label>Icon</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="📱"
                maxLength={4}
              />
              <div className="mc-icon-picker">
                {ICON_SUGGESTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="mc-icon-btn"
                    onClick={() => setForm({ ...form, icon: emoji })}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="mc-form__group">
              <label>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Electronics"
                required
                maxLength={60}
              />
            </div>
          </div>

          <div className="mc-form__group">
            <label>Description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What items belong in this category?"
              maxLength={200}
              rows={2}
            />
          </div>

          <div className="mc-form__actions">
            <button type="submit" className="mc-btn mc-btn--primary">
              {editing ? "Save changes" : "Create"}
            </button>
            <button type="button" className="mc-btn mc-btn--ghost" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mc-filters">
        {[
          { key: "active", label: "Active" },
          { key: "inactive", label: "Inactive" },
          { key: "all", label: "All" },
        ].map((f) => (
          <button
            key={f.key}
            className={`mc-chip ${filter === f.key ? "mc-chip--active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mc-empty">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="admin-page__empty">
          <p>
            {filter === "inactive"
              ? "No inactive categories."
              : filter === "active"
              ? "No categories yet — create your first one."
              : "No categories."}
          </p>
        </div>
      ) : (
        <div className="mc-grid">
          {filtered.map((cat) => (
            <div key={cat._id} className={`mc-card ${!cat.isActive ? "mc-card--inactive" : ""}`}>
              <div className="mc-card__icon">{cat.icon || "◇"}</div>
              <div className="mc-card__body">
                <div className="mc-card__header">
                  <h3 className="mc-card__name">{cat.name}</h3>
                  {!cat.isActive && <span className="mc-badge">Inactive</span>}
                </div>
                {cat.description && (
                  <p className="mc-card__desc">{cat.description}</p>
                )}
                <div className="mc-card__actions">
                  <button className="mc-btn mc-btn--ghost" onClick={() => startEdit(cat)}>
                    Edit
                  </button>
                  {cat.isActive ? (
                    <button className="mc-btn mc-btn--warning" onClick={() => handleSoftDelete(cat)}>
                      Deactivate
                    </button>
                  ) : (
                    <button className="mc-btn mc-btn--ghost" onClick={() => handleToggleActive(cat)}>
                      Reactivate
                    </button>
                  )}
                  <button className="mc-btn mc-btn--danger" onClick={() => handleHardDelete(cat)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageCategories;