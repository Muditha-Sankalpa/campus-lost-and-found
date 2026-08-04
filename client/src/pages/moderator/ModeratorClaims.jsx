import React, { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import useModeratorDashboard from '../../hooks/useModeratorDashboard';
import '../../styles/Auth.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ModeratorClaims() {
  const { token } = useContext(AuthContext);
  const { dashboard, loading, reload } = useModeratorDashboard();
  const [reviewReasons, setReviewReasons] = useState({});
  const [message, setMessage] = useState('');

  const actOnClaim = async (itemId, action) => {
    const reason = reviewReasons[itemId] || '';
    const res = await fetch(`${API_BASE}/api/admin/items/${itemId}/claims/review`, {
      method: 'POST',
      headers: token
        ? { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Claim ${action === 'approve' ? 'approved' : 'rejected'}.`);
      reload();
    } else {
      setMessage(data.message || 'Unable to complete review.');
    }
  };

  if (!dashboard) {
    return <div className="panel">{loading ? 'Loading…' : 'Loading pending claims…'}</div>;
  }

  return (
    <div className="panel panel--wide">
      <div className="panel__header">
        <div>
          <h2>Pending claims</h2>
          <p>Review ownership claims submitted against approved items. Approving reveals contact details to both parties and marks the item recovered.</p>
        </div>
      </div>

      {message ? <div className="form__message">{message}</div> : null}

      {dashboard.pendingClaims.length === 0 ? (
        <div className="empty-state">No pending claims.</div>
      ) : (
        <div className="browse-grid">
          {dashboard.pendingClaims.map((item) => (
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
                </div>
                <div className="meta-row">
                  <span>{item.category}</span>
                  <span>{item.location}</span>
                </div>
                <p><strong>Reported by:</strong> {item.reportedBy?.name}</p>
                <p><strong>Claimed by:</strong> {item.claimRequestedBy?.name} ({item.claimRequestedBy?.studentId})</p>
                {item.claimDescription && <p><strong>Claim description:</strong> {item.claimDescription}</p>}
                {item.claimProof && <p><strong>Proof:</strong> {item.claimProof}</p>}
                {item.claimContactNumber && <p><strong>Contact:</strong> {item.claimContactNumber}</p>}
                {item.claimPhoto && (
                  <div className="item-card__image" style={{ maxWidth: 200 }}>
                    <img src={`${API_BASE}${item.claimPhoto}`} alt="Claim proof" />
                  </div>
                )}

                <div className="form-group">
                  <label>Reason</label>
                  <textarea
                    rows={3}
                    value={reviewReasons[item._id] || ''}
                    onChange={(event) => setReviewReasons((prev) => ({ ...prev, [item._id]: event.target.value }))}
                    placeholder="Optional note for the review"
                  />
                </div>
                <div className="item-actions">
                  <button className="btn-primary" type="button" onClick={() => actOnClaim(item._id, 'approve')}>Approve Claim</button>
                  <button className="btn-danger" type="button" onClick={() => actOnClaim(item._id, 'reject')}>Reject Claim</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
