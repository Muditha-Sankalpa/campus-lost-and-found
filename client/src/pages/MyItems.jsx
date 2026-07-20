import React, { useState, useEffect } from "react";
import ItemCard from "../components/ItemCard";
import ItemForm from "../components/ItemForm";
import { fetchMyItems, updateItem, deleteItem } from "../api/itemApi";

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const loadItems = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMyItems(); // requires token in localStorage
      setItems(data.items);
    } catch (err) {
      setError(
        err?.response?.status === 401
          ? "You need to be logged in to see your reports."
          : "Could not reach the backend. Is the server running?"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await deleteItem(id);
      loadItems();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete");
    }
  };

  const handleUpdate = async (formData, id) => {
    await updateItem(id, formData);
    setEditingItem(null);
    loadItems();
  };

  return (
    <div className="container">
      <h2>My Reported Items</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && items.length === 0 && <p>You haven't reported any items yet.</p>}

      {editingItem && (
        <div>
          <h3>Editing: {editingItem.title}</h3>
          <ItemForm
            initialItem={editingItem}
            onSubmit={handleUpdate}
            onCancel={() => setEditingItem(null)}
          />
        </div>
      )}

      <div className="grid">
        {items.map((item) => (
          <ItemCard
            key={item._id}
            item={item}
            showModeration
            showActions
            onEdit={setEditingItem}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MyItems;
