import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/Auth.css";

function Login() {
  const { user, login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Redirect based on role once the user object is available
  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (user.role === "moderator") {
      navigate("/moderator", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const res = await login({ email, password });
    setIsSubmitting(false);
    if (!res.ok) {
      setError(res.message || "Login failed");
    }
    // Success: useEffect above handles redirect once user state updates
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p style={{ color: "var(--color-grey-600)", marginTop: 8 }}>
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          {error && <div className="form__error">{error}</div>}

          <div className="auth-actions">
            <button className="btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'}</button>
            <Link to="/register" className="btn-ghost">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;