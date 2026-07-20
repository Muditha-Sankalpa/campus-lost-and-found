import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ email, password });
    if (res.ok) {
      navigate('/');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 520, margin: "0 auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {error && <div className="form__error">{error}</div>}
        <div style={{ marginTop: 12 }}>
          <button type="submit">Login</button>
          <Link to="/register" style={{ marginLeft: 12 }}>Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;