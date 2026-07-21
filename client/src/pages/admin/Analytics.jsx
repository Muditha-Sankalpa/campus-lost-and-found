import "../../styles/admin/AdminPage.css";

function Analytics() {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">Analytics</h1>
        <p className="admin-page__subtitle">
          Recovery statistics, category trends, and user activity over time.
        </p>
      </header>

      <div className="admin-page__empty">
        <p>Charts and reports will load here.</p>
        <p className="admin-page__note">
          Waiting on Item and Claim data from the lost &amp; found module.
        </p>
      </div>
    </div>
  );
}

export default Analytics;