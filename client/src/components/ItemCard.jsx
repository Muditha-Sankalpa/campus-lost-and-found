import React from 'react';
import '../styles/Auth.css';

export default function ItemCard({ item, onRecover, onDelete }) {
  const date = new Date(item.createdAt).toLocaleString();
  const statusLabel = item.status === 'recovered' ? 'Recovered' : item.status?.charAt(0).toUpperCase() + item.status?.slice(1);
  const moderationLabel = item.moderationStatus?.charAt(0).toUpperCase() + item.moderationStatus?.slice(1);

  return (
    <div className="item-card">
      <div className="item-card__image">
        {item.images && item.images[0] ? (
          <img src={item.images[0]} alt={item.title} />
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
          </div>
        </div>

        <div className="meta-row">
          <span>{item.location}</span>
          <span>{item.category}</span>
          <span>{date}</span>
        </div>

        {(onRecover || onDelete) && (
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
          </div>
        )}
      </div>
    </div>
  );
}
