import { useState, useEffect } from "react";
import "../styles/AnnouncementBanner.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    // Remember dismissed announcements across page loads (per session)
    const stored = sessionStorage.getItem("dismissed_announcements");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/announcements`);
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(data.announcements || []);
        }
      } catch (err) {
        // Silent fail — banner just won't show
      }
    };
    fetchAnnouncements();
  }, []);

  const dismiss = (id) => {
    const next = [...dismissed, id];
    setDismissed(next);
    sessionStorage.setItem("dismissed_announcements", JSON.stringify(next));
  };

  const visible = announcements.filter((a) => !dismissed.includes(a._id));
  if (visible.length === 0) return null;

  return (
    <div className="ab-container">
      {visible.map((a) => (
        <div key={a._id} className={`ab-banner ab-banner--${a.type}`}>
          <div className="ab-banner__content">
            <span className="ab-banner__icon">
              {a.type === "urgent" ? "⚠" : a.type === "warning" ? "!" : "ℹ"}
            </span>
            <div>
              <strong className="ab-banner__title">{a.title}</strong>
              <p className="ab-banner__body">{a.body}</p>
            </div>
          </div>
          <button
            className="ab-banner__close"
            onClick={() => dismiss(a._id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default AnnouncementBanner;