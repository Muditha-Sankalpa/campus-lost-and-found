import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import '../styles/Auth.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function MyClaims() {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/items/my/claims`, {
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });
    const data = await res.json();
    if (res.ok) setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-shell">
      <div className="panel panel--wide">
        <div className="panel__header">
          <div>
            <h2>My claims</h2>
            <p>Track the ownership claims you've submitted on other people's reports.</p>
          </div>
        </div>

        {loading ? (
          <p className="empty-state">Loading your claims…</p>
        ) : items.length === 0 ? (
          <div className="empty-state">You haven't submitted any claims yet.</div>
        ) : (
          <div className="browse-grid">
            {items.map((item) => (
              <div key={item._id} className="item-card">
                <div className="item-card__image">
                  {item.images && item.images[0] ? (
                    <img src={`${API_BASE}${item.images[0]}`} alt={item.title} />
                  ) : (
                    <div className="item-card__placeholder">No image</div>
                  )}
                </div>
                <div className="item-card__content">
                  <div className="item-card__header">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className="item-card__badges">
                      <span
                        className={`status-pill ${
                          item.claimStatus === 'approved'
                            ? 'status-pill--approved'
                            : item.claimStatus === 'rejected'
                            ? 'status-pill--rejected'
                            : 'status-pill--requested'
                        }`}
                      >
                        Claim {item.claimStatus?.charAt(0).toUpperCase() + item.claimStatus?.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="meta-row">
                    <span>{item.location}</span>
                    <span>{item.category}</span>
                  </div>

                  {item.claimStatus === 'approved' && item.reportedBy && (
                    <div className="item-card__claimant">
                      <strong>Reported by:</strong> {item.reportedBy.name}
                      {item.reportedBy.phone && (
                        <>
                          {' — '}
                          <strong>Contact:</strong> {item.reportedBy.phone}
                        </>
                      )}
                      {!item.reportedBy.phone && (
                        <p style={{ margin: '4px 0 0' }}>
                          This user hasn't added a phone number to their profile yet.
                        </p>
                      )}
                    </div>
                  )}

                  {item.claimStatus === 'pending' && (
                    <div className="empty-state">Waiting for a moderator to review your claim.</div>
                  )}

                  {item.claimStatus === 'rejected' && item.claimReviewReason && (
                    <div className="empty-state">Reason: {item.claimReviewReason}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
