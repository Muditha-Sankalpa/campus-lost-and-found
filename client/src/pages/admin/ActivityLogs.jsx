import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "../../styles/admin/ActivityLogs.css";
import "../../styles/admin/AdminPage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ACTION_META = {
  "user.role_changed": { label: "Role changed", color: "purple" },
  "user.suspended": { label: "User suspended", color: "warning" },
  "user.unsuspended": { label: "User unsuspended", color: "success" },
  "user.deleted": { label: "User deleted", color: "danger" },
  "announcement.created": { label: "Announcement created", color: "success" },
  "announcement.updated": { label: "Announcement updated", color: "purple" },
  "announcement.deleted": { label: "Announcement deleted", color: "danger" },
};

function ActivityLogs() {
  const { token } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/activity?page=${page}&limit=30`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) {
        setLogs(json.logs || []);
        setPagination(json.pagination || { page: 1, totalPages: 1, total: 0 });
      } else setError(json.message || "Failed to load activity");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Activity Logs</h1>
          <p className="admin-page__subtitle">
            {pagination.total} recorded event{pagination.total !== 1 && "s"}. Every admin action is logged here.
          </p>
        </div>
      </header>

      {error && <div className="al-error">{error}</div>}

      {loading ? (
        <p className="al-empty">Loading activity…</p>
      ) : logs.length === 0 ? (
        <div className="admin-page__empty">
          <p>No activity yet.</p>
          <p className="admin-page__note">
            Actions like changing roles, suspending users, or managing announcements will appear here.
          </p>
        </div>
      ) : (
        <ul className="al-list">
          {logs.map((log) => {
            const meta = ACTION_META[log.action] || { label: log.action, color: "grey" };
            return (
              <li key={log._id} className="al-item">
                <div className="al-item__left">
                  <span className={`al-badge al-badge--${meta.color}`}>{meta.label}</span>
                  <div className="al-item__body">
                    <p className="al-item__text">
                      <strong>{log.actor?.name || "Unknown user"}</strong>
                      {log.actor?.role && (
                        <span className="al-item__role"> ({log.actor.role})</span>
                      )}
                      {" "}
                      {log.metadata?.userName && `→ target: ${log.metadata.userName}`}
                      {log.metadata?.title && `→ "${log.metadata.title}"`}
                      {log.metadata?.newRole && ` → new role: ${log.metadata.newRole}`}
                    </p>
                    <span className="al-item__meta">
                      {new Date(log.createdAt).toLocaleString()} · {log.actor?.email}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pagination.totalPages > 1 && (
        <div className="al-pagination">
          <button
            className="al-btn"
            disabled={pagination.page === 1}
            onClick={() => fetchLogs(pagination.page - 1)}
          >
            Previous
          </button>
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <button
            className="al-btn"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => fetchLogs(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ActivityLogs;