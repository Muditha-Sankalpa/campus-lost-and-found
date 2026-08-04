import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "../../styles/admin/ManageMessages.css";
import "../../styles/admin/AdminPage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const STATUS_META = {
  new: { label: "New", color: "purple" },
  read: { label: "Read", color: "grey" },
  replied: { label: "Replied", color: "success" },
  archived: { label: "Archived", color: "muted" },
};

function ManageMessages() {
  const { token } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noteDraft, setNoteDraft] = useState("");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchMessages = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.append("status", statusFilter);

      const res = await fetch(`${API_BASE}/api/contact/admin?${params}`, {
        headers: authHeaders(),
      });
      const data = await res.json();

      if (res.ok) {
        setMessages(data.messages || []);
        setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
        setUnreadCount(data.unreadCount || 0);
      } else {
        setError(data.message || "Failed to load messages");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const openMessage = async (msg) => {
    setSelected(msg);
    setNoteDraft(msg.adminNote || "");
    // Auto-mark 'new' messages as 'read' when opened
    if (msg.status === "new") {
      await updateStatus(msg._id, "read");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/api/contact/admin/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = data.contactMessage;
        setMessages((prev) => prev.map((m) => (m._id === id ? updated : m)));
        if (selected?._id === id) setSelected(updated);
        // Refresh unread count when a 'new' message gets touched
        if (status !== "new") setUnreadCount((c) => Math.max(0, c - 1));
      } else {
        setError(data.message || "Failed to update");
      }
    } catch {
      setError("Network error");
    }
  };

  const saveNote = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`${API_BASE}/api/contact/admin/${selected._id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ adminNote: noteDraft }),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = data.contactMessage;
        setMessages((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
        setSelected(updated);
      } else {
        setError(data.message || "Failed to save note");
      }
    } catch {
      setError("Network error");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/contact/admin/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (selected?._id === id) setSelected(null);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Contact Messages</h1>
          <p className="admin-page__subtitle">
            {pagination.total} total message{pagination.total !== 1 && "s"}
            {unreadCount > 0 && ` — ${unreadCount} unread`}
          </p>
        </div>
      </header>

      {error && <div className="mm-error">{error}</div>}

      <div className="mm-filters">
        {[
          { key: "", label: "All" },
          { key: "new", label: "New" },
          { key: "read", label: "Read" },
          { key: "replied", label: "Replied" },
          { key: "archived", label: "Archived" },
        ].map((f) => (
          <button
            key={f.key || "all"}
            className={`mm-chip ${statusFilter === f.key ? "mm-chip--active" : ""}`}
            onClick={() => setStatusFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mm-layout">
        {/* --- List --- */}
        <div className="mm-list">
          {loading ? (
            <p className="mm-empty">Loading…</p>
          ) : messages.length === 0 ? (
            <div className="admin-page__empty">
              <p>No messages match.</p>
            </div>
          ) : (
            messages.map((m) => {
              const meta = STATUS_META[m.status];
              return (
                <button
                  key={m._id}
                  className={`mm-item ${selected?._id === m._id ? "mm-item--active" : ""} ${
                    m.status === "new" ? "mm-item--unread" : ""
                  }`}
                  onClick={() => openMessage(m)}
                >
                  <div className="mm-item__header">
                    <span className="mm-item__name">{m.name}</span>
                    <span className={`mm-badge mm-badge--${meta.color}`}>{meta.label}</span>
                  </div>
                  <span className="mm-item__subject">{m.subject}</span>
                  <span className="mm-item__meta">
                    {m.email} · {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </button>
              );
            })
          )}

          {pagination.totalPages > 1 && (
            <div className="mm-pagination">
              <button
                className="mm-btn mm-btn--ghost"
                disabled={pagination.page === 1}
                onClick={() => fetchMessages(pagination.page - 1)}
              >
                Prev
              </button>
              <span className="mm-page-info">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                className="mm-btn mm-btn--ghost"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchMessages(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* --- Detail panel --- */}
        <div className="mm-detail">
          {!selected ? (
            <div className="mm-detail__empty">
              <p>Select a message from the list to view details.</p>
            </div>
          ) : (
            <>
              <div className="mm-detail__header">
                <div>
                  <h2 className="mm-detail__subject">{selected.subject}</h2>
                  <p className="mm-detail__meta">
                    <strong>{selected.name}</strong> &lt;{selected.email}&gt;
                    {selected.submittedBy && (
                      <span className="mm-detail__badge">
                        Registered user ({selected.submittedBy.role})
                      </span>
                    )}
                  </p>
                  <p className="mm-detail__timestamp">
                    Received {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="mm-detail__status">
                  <label>Status</label>
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected._id, e.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="mm-detail__body">
                <p>{selected.message}</p>
              </div>

              <div className="mm-detail__note">
                <label>Admin note (private)</label>
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add a private note for other admins..."
                  rows={3}
                  maxLength={1000}
                />
                <button className="mm-btn mm-btn--primary" onClick={saveNote}>
                  Save note
                </button>
                {selected.handledBy && selected.handledAt && (
                  <p className="mm-detail__handled">
                    Last handled by {selected.handledBy.name} on{" "}
                    {new Date(selected.handledAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="mm-detail__actions">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="mm-btn mm-btn--primary"
                >
                  Reply via email
                </a>
                <button
                  className="mm-btn mm-btn--danger"
                  onClick={() => deleteMessage(selected._id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageMessages;