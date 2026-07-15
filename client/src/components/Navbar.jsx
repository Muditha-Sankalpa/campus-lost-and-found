import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const links = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Login", path: "/login" },
  ];

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
      </ul>
    </nav>
  );
}

export default Navbar;