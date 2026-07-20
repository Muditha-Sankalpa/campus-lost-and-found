import "../styles/Navbar.css";

import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const links = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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

        {!user && (
          <li className="navbar__item">
            <NavLink to="/login" className="navbar__link">Login</NavLink>
          </li>
        )}

        {user && (
          <>
            <li className="navbar__item">
              <NavLink to="/profile" className="navbar__link">Profile</NavLink>
            </li>
            {user.role === 'admin' && (
              <li className="navbar__item">
                <NavLink to="/admin" className="navbar__link">Admin</NavLink>
              </li>
            )}
            <li className="navbar__item">
              <button onClick={handleLogout} className="navbar__link navbar__link--button">Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;