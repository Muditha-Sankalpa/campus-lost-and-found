import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import "../styles/Auth.css";

function Profile() {
  const { user, updateProfile, loadUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAvatarUrl((user.profile && user.profile.avatarUrl) || "");
      setBio((user.profile && user.profile.bio) || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile({ name, phone, profile: { avatarUrl, bio } });
    if (res.ok) {
      setMessage('Profile updated');
      await loadUser();
    } else {
      setMessage(res.message || 'Update failed');
    }
  };

  if (!user) return <div style={{ padding: 20 }}>You need to be logged in to view this page.</div>;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).slice(0,2).join('') : '?';

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 720 }}>
        <div className="profile-header">
          <div className="avatar">{initials}</div>
          <div className="profile-meta">
            <h2 style={{ marginBottom: 6 }}>{user.name}</h2>
            <p style={{ color: 'var(--color-grey-600)' }}>{user.email}</p>
          </div>
        </div>

        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Student ID:</strong> {user.studentId}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Phone number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Shared with a claimant once your item claim is approved" />
          </div>

          <div className="form-group">
            <label>Avatar URL</label>
            <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          {message && <div className="form__message">{message}</div>}

          <div className="auth-actions">
            <button className="btn-primary" type="submit">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
