import React from 'react';
import useModeratorDashboard from '../../hooks/useModeratorDashboard';
import '../../styles/Auth.css';

export default function ModeratorOverview() {
  const { dashboard, loading } = useModeratorDashboard();

  if (!dashboard) {
    return <div className="panel">{loading ? 'Loading…' : 'Loading moderator workspace…'}</div>;
  }

  const { stats } = dashboard;

  return (
    <div className="panel panel--wide">
      <div className="panel__header">
        <div>
          <h2>Moderator overview</h2>
          <p>A snapshot of report and claim activity across the platform.</p>
        </div>
      </div>

      <div className="browse-grid">
        <div className="item-card"><div className="item-card__content"><strong>Total items</strong><p>{stats.totalItems}</p></div></div>
        <div className="item-card"><div className="item-card__content"><strong>Pending items</strong><p>{stats.pendingItems}</p></div></div>
        <div className="item-card"><div className="item-card__content"><strong>Approved items</strong><p>{stats.approvedItems}</p></div></div>
        <div className="item-card"><div className="item-card__content"><strong>Recovered items</strong><p>{stats.recoveredItems}</p></div></div>
        <div className="item-card"><div className="item-card__content"><strong>Rejected items</strong><p>{stats.rejectedItems}</p></div></div>
        <div className="item-card"><div className="item-card__content"><strong>Pending claims</strong><p>{dashboard.pendingClaims.length}</p></div></div>
      </div>
    </div>
  );
}
