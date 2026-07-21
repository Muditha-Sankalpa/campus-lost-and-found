import "../../styles/admin/AdminDashboard.css";

function AdminDashboard() {
  // Placeholder data — will be replaced with real API calls later
  const stats = [
    { label: "Total Users", value: "—", trend: "Active students, moderators, admins" },
    { label: "Total Items Reported", value: "—", trend: "Lost + Found combined" },
    { label: "Successful Recoveries", value: "—", trend: "Items returned to owners" },
    { label: "Pending Reviews", value: "—", trend: "Awaiting moderator action" },
  ];

  const recentActivity = [
    { time: "—", action: "System is ready. Live activity will appear here." },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title">Dashboard</h1>
          <p className="admin-dashboard__subtitle">
            Welcome back. Here's what's happening across UniFind today.
          </p>
        </div>
      </header>

      <section className="admin-dashboard__stats">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="stat-card__label">{stat.label}</span>
            <span className="stat-card__value">{stat.value}</span>
            <span className="stat-card__trend">{stat.trend}</span>
          </div>
        ))}
      </section>

      <section className="admin-dashboard__panels">
        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Recent Activity</h2>
            <span className="panel__hint">Last 24 hours</span>
          </div>
          <ul className="activity-list">
            {recentActivity.map((item, i) => (
              <li key={i} className="activity-item">
                <span className="activity-item__time">{item.time}</span>
                <span className="activity-item__text">{item.action}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button className="quick-action">Manage Users</button>
            <button className="quick-action">Add Category</button>
            <button className="quick-action">View Analytics</button>
            <button className="quick-action">Review Logs</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;