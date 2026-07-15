import "../styles/Navbar.css";

function Navbar() {
  const links = ["Home", "About", "Contact", "Login"];

  return (
    <nav className="navbar">
      <ul className="navbar__list">
        {links.map((link, index) => (
          <li key={link} className={`navbar__item ${index === 0 ? "navbar__item--active" : ""}`}>
            {link}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;