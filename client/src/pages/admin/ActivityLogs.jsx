import "../../styles/admin/AdminPage.css";

function ActivityLogs() {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">Activity Logs</h1>
        <p className="admin-page__subtitle">
          Timeline of moderator and administrator actions across the platform.
        </p>
      </header>

      <div className="admin-page__empty">
        <p>Activity log entries will load here.</p>
        <p className="admin-page__note">
          Waiting on ModerationLog data from the moderator module.
        </p>
      </div>
    </div>
  );
}

export default ActivityLogs;