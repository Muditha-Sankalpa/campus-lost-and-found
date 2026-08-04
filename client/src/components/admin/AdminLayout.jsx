import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "../../styles/admin/AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "▦", end: true },
    { path: "/admin/users", label: "Users", icon: "◉" },
    { path: "/admin/categories", label: "Categories", icon: "☰" },
    { path: "/admin/messages", label: "Messages", icon: "✉" },
    { path: "/admin/announcements", label: "Announcements", icon: "◆" },
    { path: "/admin/analytics", label: "Analytics", icon: "▲" },
    { path: "/admin/activity", label: "Activity Logs", icon: "⏱" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <span className="admin-sidebar__badge">ADMIN</span>
          <span className="admin-sidebar__subtitle">UniFind Control</span>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? "admin-sidebar__link admin-sidebar__link--active"
                  : "admin-sidebar__link"
              }
            >
              <span className="admin-sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <span className="admin-sidebar__icon">⎋</span>
            <span>Log out</span>
          </button>
          <p className="admin-sidebar__hint">
            {user ? `Signed in as ${user.name}` : "Signed in as Administrator"}
          </p>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;