import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthProvider";

function Profile() {
  const { user, updateProfile, loadUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatarUrl((user.profile && user.profile.avatarUrl) || "");
      setBio((user.profile && user.profile.bio) || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile({ name, profile: { avatarUrl, bio } });
    if (res.ok) {
      setMessage('Profile updated');
      await loadUser();
    } else {
      setMessage(res.message || 'Update failed');
    }
  };

  if (!user) return <div style={{ padding: 20 }}>You need to be logged in to view this page.</div>;

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h2>Profile</h2>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Student ID:</strong> {user.studentId}</p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Avatar URL
          <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
        </label>
        <label>
          Bio
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        {message && <div className="form__message">{message}</div>}
        <div style={{ marginTop: 12 }}>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
