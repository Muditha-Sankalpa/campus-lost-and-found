import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

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
    <div style={{ padding: "24px", maxWidth: 560, margin: "0 auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Student ID
          <input value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
        </label>
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
          <button type="submit">Create account</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
