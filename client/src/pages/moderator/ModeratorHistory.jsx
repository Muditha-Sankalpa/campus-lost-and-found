import React, { useMemo, useState } from 'react';
import useModeratorDashboard from '../../hooks/useModeratorDashboard';
import '../../styles/Auth.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const TABS = [
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'recovered', label: 'Recovered' },
];

export default function ModeratorHistory() {
  const { dashboard, loading } = useModeratorDashboard();
  const [activeTab, setActiveTab] = useState('approved');

  const items = useMemo(() => {
    if (!dashboard) return [];
    if (activeTab === 'approved') return dashboard.approvedItems;
    if (activeTab === 'rejected') return dashboard.rejectedReports;
    return dashboard.recoveredItems;
  }, [dashboard, activeTab]);

  if (!dashboard) {
    return <div className="panel">{loading ? 'Loading…' : 'Loading history…'}</div>;
  }

  return (
    <div className="panel panel--wide">
      <div className="panel__header">
        <div>
          <h2>History</h2>
          <p>Approved, rejected, and recovered items.</p>
        </div>
      </div>

      <div className="pill-group" role="tablist" aria-label="History filters">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`pill ${activeTab === tab.key ? 'pill--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="empty-state">Nothing here yet.</div>
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
                  <span className={`status-pill status-pill--${activeTab === 'recovered' ? 'recovered' : activeTab}`}>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </span>
                </div>
                <div className="meta-row">
                  <span>{item.category}</span>
                  <span>{item.location}</span>
                </div>
                <p><strong>Reported by:</strong> {item.reportedBy?.name}</p>
                {activeTab === 'recovered' && item.claimRequestedBy && (
                  <p><strong>Recovered by:</strong> {item.claimRequestedBy?.name}</p>
                )}
                {activeTab === 'rejected' && item.moderationReason && (
                  <p><strong>Reason:</strong> {item.moderationReason}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
