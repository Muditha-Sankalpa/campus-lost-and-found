import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import '../styles/Auth.css';

export default function ModeratorDashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [reviewReasons, setReviewReasons] = useState({});

  const loadDashboard = async () => {
    setLoading(true);
    const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/admin/moderator/dashboard', {
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });
    const data = await res.json();
    if (res.ok) setDashboard(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'moderator' && user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadDashboard();
  }, [navigate, token, user]);

  const actOnItem = async (itemId, action) => {
    const reason = reviewReasons[itemId] || '';
    const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + `/api/admin/items/${itemId}/review`, {
      method: 'POST',
      headers: token ? { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Item ${action === 'approve' ? 'approved' : 'rejected'}.`);
      loadDashboard();
    } else {
      setMessage(data.message || 'Unable to complete review.');
    }
  };

  const actOnClaim = async (itemId, action) => {
    const reason = reviewReasons[itemId] || '';
    const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + `/api/admin/items/${itemId}/claims/review`, {
      method: 'POST',
      headers: token ? { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Claim ${action === 'approve' ? 'approved' : 'rejected'}.`);
      loadDashboard();
    } else {
      setMessage(data.message || 'Unable to complete review.');
    }
  };

  const renderCard = (item, kind) => (
    <div key={item._id} className="item-card">
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
        {kind === 'claim' && item.claimDescription && <p><strong>Claim:</strong> {item.claimDescription}</p>}
        {kind === 'claim' && item.claimProof && <p><strong>Proof:</strong> {item.claimProof}</p>}
        {kind === 'claim' && item.claimContactNumber && <p><strong>Contact:</strong> {item.claimContactNumber}</p>}
        {kind === 'approved' ? (
          <span className="pill pill--active">Approved</span>
        ) : (
          <>
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
              {kind === 'item' ? (
                <>
                  <button className="btn-primary" type="button" onClick={() => actOnItem(item._id, 'approve')}>Approve</button>
                  <button className="btn-danger" type="button" onClick={() => actOnItem(item._id, 'reject')}>Reject</button>
                </>
              ) : (
                <>
                  <button className="btn-primary" type="button" onClick={() => actOnClaim(item._id, 'approve')}>Approve Claim</button>
                  <button className="btn-danger" type="button" onClick={() => actOnClaim(item._id, 'reject')}>Reject Claim</button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (!dashboard) return <div className="page-shell"><div className="panel">{loading ? 'Loading…' : 'Loading moderator workspace…'}</div></div>;

  return (
    <div className="page-shell">
      <div className="panel panel--wide">
        <div className="panel__header">
          <div>
            <h2>Moderator dashboard</h2>
            <p>Review pending reports, claims, and moderation decisions in one place.</p>
          </div>
        </div>
        {message ? <div className="form__message">{message}</div> : null}
        <div className="pill-group">
          <span className="pill pill--active">Pending Items</span>
          <span className="pill pill--active">Pending Claims</span>
          <span className="pill pill--active">Approved Items</span>
          <span className="pill pill--active">Rejected Reports</span>
          <span className="pill pill--active">Statistics</span>
        </div>

        <div className="panel__header">
          <h3>Statistics</h3>
        </div>
        <div className="browse-grid">
          <div className="item-card"><div className="item-card__content"><strong>Total items</strong><p>{dashboard.stats.totalItems}</p></div></div>
          <div className="item-card"><div className="item-card__content"><strong>Pending items</strong><p>{dashboard.stats.pendingItems}</p></div></div>
          <div className="item-card"><div className="item-card__content"><strong>Approved items</strong><p>{dashboard.stats.approvedItems}</p></div></div>
          <div className="item-card"><div className="item-card__content"><strong>Recovered items</strong><p>{dashboard.stats.recoveredItems}</p></div></div>
          <div className="item-card"><div className="item-card__content"><strong>Rejected items</strong><p>{dashboard.stats.rejectedItems}</p></div></div>
        </div>

        <div className="panel__header">
          <h3>Pending Items</h3>
        </div>
        {dashboard.pendingItems.length === 0 ? <div className="empty-state">No pending items.</div> : <div className="browse-grid">{dashboard.pendingItems.map((item) => renderCard(item, 'item'))}</div>}

        <div className="panel__header">
          <h3>Pending Claims</h3>
        </div>
        {dashboard.pendingClaims.length === 0 ? <div className="empty-state">No pending claims.</div> : <div className="browse-grid">{dashboard.pendingClaims.map((item) => renderCard(item, 'claim'))}</div>}

        <div className="panel__header">
          <h3>Approved Items</h3>
        </div>
        {dashboard.approvedItems.length === 0 ? <div className="empty-state">No approved items yet.</div> : <div className="browse-grid">{dashboard.approvedItems.map((item) => renderCard(item, 'approved'))}</div>}

        <div className="panel__header">
          <h3>Rejected Reports</h3>
        </div>
        {dashboard.rejectedReports.length === 0 ? <div className="empty-state">No rejected reports.</div> : <div className="browse-grid">{dashboard.rejectedReports.map((item) => renderCard(item, 'item'))}</div>}
      </div>
    </div>
  );
}
