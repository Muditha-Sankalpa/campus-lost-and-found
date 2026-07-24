import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const publicLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const authedLinks = [
    { label: "Browse", path: "/browse" },
    { label: "Report", path: "/report" },
    { label: "My Items", path: "/myitems" },
  ];

  const links = user ? [...publicLinks, ...authedLinks] : publicLinks;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <ul className="navbar__list">
        {links.map((link) => (
          <li key={link.path} className="navbar__item">
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                isActive ? "navbar__link navbar__link--active" : "navbar__link"
              }
              end={link.path === "/"}
            >
              {link.label}
            </NavLink>
          </li>
        ))}

        {user ? (
          <>
            <li className="navbar__item">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "navbar__link navbar__link--active" : "navbar__link"
                }
              >
                Profile
              </NavLink>
            </li>

            {user.role === "admin" && (
              <li className="navbar__item">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? "navbar__link navbar__link--active" : "navbar__link"
                  }
                >
                  Admin
                </NavLink>
              </li>
            )}

            <li className="navbar__item">
              <button className="navbar__logout" onClick={handleLogout}>
                Log out
              </button>
            </li>
          </>
        ) : (
          <li className="navbar__item">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "navbar__link navbar__link--active" : "navbar__link"
              }
            >
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;