import "../styles/Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <span className="footer__brand">UniFind</span>
        <span className="footer__divider">•</span>
        <span className="footer__text">University of Colombo</span>
        <span className="footer__divider">•</span>
        <span className="footer__text">&copy; {year} All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;