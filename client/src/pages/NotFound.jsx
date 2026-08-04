import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/Hero.css";

function NotFound() {
  const { user } = useContext(AuthContext);

  let backPath = "/login";
  let backLabel = "Back to Login";
  if (user?.role === "admin") {
    backPath = "/admin";
    backLabel = "Back to Dashboard";
  } else if (user?.role === "moderator") {
    backPath = "/moderator";
    backLabel = "Back to Dashboard";
  } else if (user) {
    backPath = "/";
    backLabel = "Back to Home";
  }

  return (
    <section className="hero">
      <div className="hero__content">
        <span className="hero__eyebrow">Error 404</span>
        <h1 className="hero__title">
          This page wandered off campus.
          <br />
          Let's get you back.
        </h1>
        <p className="hero__subtitle">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="hero__actions">
          <Link to={backPath} className="hero__btn hero__btn--primary">
            {backLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
