import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import "../styles/Auth.css";

function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register({ name, studentId, email, password });
    if (res.ok) {
      navigate('/');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create your account</h2>
        <p style={{ color: 'var(--color-grey-600)', marginTop: 8 }}>Register as a student to access UniFind</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Student ID</label>
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>

          {error && <div className="form__error">{error}</div>}

          <div className="auth-actions">
            <button className="btn-primary" type="submit">Create account</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
