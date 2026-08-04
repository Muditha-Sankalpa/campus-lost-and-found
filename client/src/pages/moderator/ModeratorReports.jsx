import React, { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import useModeratorDashboard from '../../hooks/useModeratorDashboard';
import '../../styles/Auth.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ModeratorReports() {
  const { token } = useContext(AuthContext);
  const { dashboard, loading, reload } = useModeratorDashboard();
  const [reviewReasons, setReviewReasons] = useState({});
  const [message, setMessage] = useState('');

  const actOnItem = async (itemId, action) => {
    const reason = reviewReasons[itemId] || '';
    const res = await fetch(`${API_BASE}/api/admin/items/${itemId}/review`, {
      method: 'POST',
      headers: token
        ? { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Item ${action === 'approve' ? 'approved' : 'rejected'}.`);
      reload();
    } else {
      setMessage(data.message || 'Unable to complete review.');
    }
  };

  if (!dashboard) {
    return <div className="panel">{loading ? 'Loading…' : 'Loading pending reports…'}</div>;
  }

  return (
    <div className="panel panel--wide">
      <div className="panel__header">
        <div>
          <h2>Pending reports</h2>
          <p>Approve or reject newly submitted lost &amp; found reports.</p>
        </div>
      </div>

      {message ? <div className="form__message">{message}</div> : null}

      {dashboard.pendingItems.length === 0 ? (
        <div className="empty-state">No pending items.</div>
      ) : (
        <div className="browse-grid">
          {dashboard.pendingItems.map((item) => (
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
                <p><strong>Reported by:</strong> {item.reportedBy?.name} ({item.reportedBy?.studentId})</p>

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
                  <button className="btn-primary" type="button" onClick={() => actOnItem(item._id, 'approve')}>Approve</button>
                  <button className="btn-danger" type="button" onClick={() => actOnItem(item._id, 'reject')}>Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
