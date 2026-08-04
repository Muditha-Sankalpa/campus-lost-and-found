import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__content">
        <span className="hero__eyebrow">Campus Lost &amp; Found</span>
        <h1 className="hero__title">
          Lost something on campus?
          <br />
          Let's help you find it.
        </h1>
        <p className="hero__subtitle">
          UniFind connects students across the University of Colombo to report,
          search, and recover lost belongings — quickly and securely.
        </p>
        <div className="hero__actions">
          <button className="hero__btn hero__btn--primary" onClick={() => navigate('/report')}>
            Report an Item
          </button>
          <button className="hero__btn hero__btn--secondary" onClick={() => navigate('/browse')}>
            Browse Listings
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;