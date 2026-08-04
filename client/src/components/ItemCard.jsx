import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import '../styles/Auth.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ItemCard({ item, onRecover, onDelete, onClaim }) {
  const { token } = useContext(AuthContext);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimDescription, setClaimDescription] = useState('');
  const [claimProof, setClaimProof] = useState('');
  const [claimContactNumber, setClaimContactNumber] = useState('');
  const [claimPhoto, setClaimPhoto] = useState(null);
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');
  const date = new Date(item.createdAt).toLocaleString();
  const statusLabel = item.status === 'recovered' ? 'Recovered' : item.status?.charAt(0).toUpperCase() + item.status?.slice(1);
  const moderationLabel = item.moderationStatus?.charAt(0).toUpperCase() + item.moderationStatus?.slice(1);

  const handleClaim = async (event) => {
    event.preventDefault();
    setClaimError('');
    setClaimSuccess('');

    const form = new FormData();
    form.append('claimDescription', claimDescription);
    form.append('claimProof', claimProof);
    form.append('claimContactNumber', claimContactNumber);
    if (claimPhoto) form.append('claimPhoto', claimPhoto);

    const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + `/api/items/${item._id}/claim`, {
      method: 'POST',
      headers: token ? { Authorization: 'Bearer ' + token } : {},
      body: form,
    });
    const data = await res.json();
    if (res.ok) {
      setClaimSuccess('Your ownership claim has been submitted for moderator review.');
      setClaimDescription('');
      setClaimProof('');
      setClaimContactNumber('');
      setClaimPhoto(null);
      setShowClaimForm(false);
      onClaim && onClaim(item._id, data.item);
    } else {
      setClaimError(data.message || 'Unable to submit claim.');
    }
  };

  return (
    <div className="item-card">
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
            <span className={`status-pill ${item.status === 'recovered' ? 'status-pill--recovered' : item.status === 'found' ? 'status-pill--found' : 'status-pill--lost'}`}>{statusLabel}</span>
            <span className={`status-pill ${item.moderationStatus === 'approved' ? 'status-pill--approved' : item.moderationStatus === 'rejected' ? 'status-pill--rejected' : 'status-pill--pending'}`}>{moderationLabel}</span>
            {item.claimStatus === 'pending' && <span className="status-pill status-pill--requested">Requested to Claim</span>}
          </div>
        </div>

        {onRecover && item.claimStatus === 'approved' && (
          <div className="item-card__claimant">
            <strong>Claimed by:</strong> {item.claimRequestedBy?.name || 'A user'}
            {item.claimContactNumber && <> — <strong>Contact:</strong> {item.claimContactNumber}</>}
          </div>
        )}

        <div className="meta-row">
          <span>{item.location}</span>
          <span>{item.category}</span>
          <span>{date}</span>
        </div>

        <div className="item-actions">
          {onRecover && (
            <button className="btn-ghost" type="button" onClick={() => onRecover(item._id)}>
              Mark recovered
            </button>
          )}
          {onDelete && (
            <button className="btn-danger" type="button" onClick={() => onDelete(item._id)}>
              Delete
            </button>
          )}
          {onClaim && item.claimStatus !== 'pending' && item.claimStatus !== 'approved' && (
            <button className="btn-primary" type="button" onClick={() => setShowClaimForm((prev) => !prev)}>
              Claim Item
            </button>
          )}
        </div>

        {showClaimForm && (
          <form className="auth-form" onSubmit={handleClaim}>
            <div className="form-group">
              <label>Describe the item</label>
              <textarea value={claimDescription} onChange={(event) => setClaimDescription(event.target.value)} required rows={3} />
            </div>
            <div className="form-group">
              <label>Proof</label>
              <textarea value={claimProof} onChange={(event) => setClaimProof(event.target.value)} required rows={3} />
            </div>
            <div className="form-group">
              <label>Photo (optional)</label>
              <input type="file" accept="image/*" onChange={(event) => setClaimPhoto(event.target.files[0])} />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input value={claimContactNumber} onChange={(event) => setClaimContactNumber(event.target.value)} required />
            </div>
            {claimError && <div className="form__error">{claimError}</div>}
            {claimSuccess && <div className="form__message">{claimSuccess}</div>}
            <div className="auth-actions">
              <button className="btn-primary" type="submit">Submit claim</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
