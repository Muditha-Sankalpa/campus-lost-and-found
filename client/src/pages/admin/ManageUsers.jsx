import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "../../styles/admin/ManageUsers.css";
import "../../styles/admin/AdminPage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function ManageUsers() {
  const { token, user: currentUser } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (roleFilter) params.append("role", roleFilter);
      if (search) params.append("search", search);

      const res = await fetch(`${API_BASE}/api/admin/users?${params}`, {
        headers: authHeaders(),
      });
      const data = await res.json();

      if (res.ok) {
        setUsers(data.users || []);
        setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
      } else {
        setError(data.message || "Failed to load users");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: data.user.role } : u))
        );
      } else {
        setError(data.message || "Failed to change role");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const handleToggleSuspend = async (userId) => {
    if (!window.confirm("Toggle suspension for this user?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}/suspend`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId
              ? { ...u, isSuspended: data.user.isSuspended, suspendedAt: data.user.suspendedAt }
              : u
          )
        );
      } else {
        setError(data.message || "Failed to update suspension");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete ${userName}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete user");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Manage Users</h1>
          <p className="admin-page__subtitle">
            {pagination.total} total user{pagination.total !== 1 && "s"}. Change roles, suspend accounts, or remove users.
          </p>
        </div>
      </header>

      {error && <div className="mu-error">{error}</div>}

      <div className="mu-toolbar">
        <form className="mu-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by name, email, or student ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="mu-btn mu-btn--primary">Search</button>
        </form>

        <div className="mu-filters">
          {["", "student", "moderator", "admin"].map((r) => (
            <button
              key={r || "all"}
              className={`mu-chip ${roleFilter === r ? "mu-chip--active" : ""}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === "" ? "All" : r.charAt(0).toUpperCase() + r.slice(1) + "s"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mu-empty">Loading users…</p>
      ) : users.length === 0 ? (
        <div className="admin-page__empty">
          <p>No users match those filters.</p>
        </div>
      ) : (
        <div className="mu-table-wrapper">
          <table className="mu-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = currentUser && String(currentUser._id) === String(u._id);
                return (
                  <tr key={u._id} className={u.isSuspended ? "mu-row--suspended" : ""}>
                    <td>
                      <div className="mu-name">
                        {u.name}
                        {isSelf && <span className="mu-you">You</span>}
                      </div>
                    </td>
                    <td className="mu-mono">{u.email}</td>
                    <td className="mu-mono">{u.studentId}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={isSelf}
                        className={`mu-role mu-role--${u.role}`}
                      >
                        <option value="student">Student</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      {u.isSuspended ? (
                        <span className="mu-badge mu-badge--suspended">Suspended</span>
                      ) : (
                        <span className="mu-badge mu-badge--active">Active</span>
                      )}
                    </td>
                    <td className="mu-date">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="mu-actions">
                        <button
                          className="mu-btn mu-btn--ghost"
                          onClick={() => handleToggleSuspend(u._id)}
                          disabled={isSelf}
                        >
                          {u.isSuspended ? "Unsuspend" : "Suspend"}
                        </button>
                        <button
                          className="mu-btn mu-btn--danger"
                          onClick={() => handleDelete(u._id, u.name)}
                          disabled={isSelf}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mu-pagination">
          <button
            className="mu-btn mu-btn--ghost"
            onClick={() => fetchUsers(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span className="mu-page-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="mu-btn mu-btn--ghost"
            onClick={() => fetchUsers(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;