import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "../../styles/moderator/ModeratorLayout.css";

function ModeratorLayout() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { path: "/moderator", label: "Overview", icon: "▦", end: true },
    { path: "/moderator/reports", label: "Reports", icon: "☰" },
    { path: "/moderator/claims", label: "Claims", icon: "◉" },
    { path: "/moderator/history", label: "History", icon: "⏱" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="moderator-layout">
      <aside className="moderator-sidebar">
        <div className="moderator-sidebar__header">
          <span className="moderator-sidebar__badge">MODERATOR</span>
          <span className="moderator-sidebar__subtitle">UniFind Moderation</span>
        </div>

        <nav className="moderator-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? "moderator-sidebar__link moderator-sidebar__link--active"
                  : "moderator-sidebar__link"
              }
            >
              <span className="moderator-sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="moderator-sidebar__footer">
          <button className="moderator-sidebar__logout" onClick={handleLogout}>
            <span className="moderator-sidebar__icon">⎋</span>
            <span>Log out</span>
          </button>
          <p className="moderator-sidebar__hint">
            {user ? `Signed in as ${user.name}` : "Signed in as Moderator"}
          </p>
        </div>
      </aside>

      <main className="moderator-main">
        <Outlet />
      </main>
    </div>
  );
}

export default ModeratorLayout;
