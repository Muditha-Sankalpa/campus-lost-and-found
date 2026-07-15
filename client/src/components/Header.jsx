import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__mark">UF</span>
        <div className="header__text">
          <span className="header__name">UniFind</span>
          <span className="header__tagline">University of Colombo</span>
        </div>
      </div>
    </header>
  );
}

export default Header;