import "../../styles/admin/AdminPage.css";

function ManageCategories() {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">Manage Categories</h1>
        <p className="admin-page__subtitle">
          Add, edit, or remove the categories students use to classify lost and found items.
        </p>
      </header>

      <div className="admin-page__empty">
        <p>Category management will load here.</p>
        <p className="admin-page__note">
          Next up: build the Category model and CRUD interface.
        </p>
      </div>
    </div>
  );
}

export default ManageCategories;