import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "../../styles/admin/AdminDashboard.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ACTION_LABELS = {
  "user.role_changed": "changed a user's role",
  "user.suspended": "suspended a user",
  "user.unsuspended": "unsuspended a user",
  "user.deleted": "deleted a user",
  "announcement.created": "created an announcement",
  "announcement.updated": "updated an announcement",
  "announcement.deleted": "deleted an announcement",
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (res.ok) setData(json);
        else setError(json.message || "Failed to load dashboard");
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <p className="ad-loading">Loading dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="ad-error">{error}</div>
      </div>
    );
  }

  const stats = data.stats;

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      trend: `${stats.newUsersThisWeek} new this week`,
    },
    {
      label: "Suspended Accounts",
      value: stats.suspendedUsers,
      trend: stats.suspendedUsers > 0 ? "Needs attention" : "All clear",
    },
    {
      label: "Active Announcements",
      value: stats.activeAnnouncements,
      trend: `${stats.totalAnnouncements} total`,
    },
    {
      label: "Items Reported",
      value: stats.totalItems,
      trend: stats.pendingReviews > 0 ? `${stats.pendingReviews} pending review` : `${stats.recoveredItems} recovered`,
    },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title">Dashboard</h1>
          <p className="admin-dashboard__subtitle">
            Welcome back. Here's what's happening across UniFind today.
          </p>
        </div>
      </header>

      <section className="admin-dashboard__stats">
        {statCards.map((s) => (
          <div key={s.label} className="stat-card">
            <span className="stat-card__label">{s.label}</span>
            <span className="stat-card__value">{s.value}</span>
            <span className="stat-card__trend">{s.trend}</span>
          </div>
        ))}
      </section>

      <section className="admin-dashboard__panels">
        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Recent Activity</h2>
            <Link to="/admin/activity" className="panel__hint panel__hint--link">
              View all →
            </Link>
          </div>
          {data.recentActivity.length === 0 ? (
            <p className="ad-empty">No activity yet. Actions will appear here as they happen.</p>
          ) : (
            <ul className="activity-list">
              {data.recentActivity.map((log) => (
                <li key={log._id} className="activity-item">
                  <span className="activity-item__time">{timeAgo(log.createdAt)}</span>
                  <span className="activity-item__text">
                    <strong>{log.actor?.name || "Someone"}</strong>{" "}
                    {ACTION_LABELS[log.action] || log.action}
                    {log.metadata?.userName && ` (${log.metadata.userName})`}
                    {log.metadata?.title && `: "${log.metadata.title}"`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/admin/users" className="quick-action">Manage Users</Link>
            <Link to="/admin/announcements" className="quick-action">New Announcement</Link>
            <Link to="/admin/analytics" className="quick-action">View Analytics</Link>
            <Link to="/admin/activity" className="quick-action">Activity Logs</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;