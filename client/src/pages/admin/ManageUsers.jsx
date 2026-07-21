import "../../styles/admin/AdminPage.css";

function ManageUsers() {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">Manage Users</h1>
        <p className="admin-page__subtitle">
          View, promote, suspend, or remove students and moderators.
        </p>
      </header>

      <div className="admin-page__empty">
        <p>User management table will load here.</p>
        <p className="admin-page__note">
          Waiting on the User model from the authentication module.
        </p>
      </div>
    </div>
  );
}

export default ManageUsers;