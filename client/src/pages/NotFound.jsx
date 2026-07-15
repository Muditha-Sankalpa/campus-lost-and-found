import { Link } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__code">404</h1>
      <p className="not-found__message">Page Not Found</p>
      <Link to="/" className="not-found__link">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;