import React, { useState, useEffect, useCallback } from "react";
import ItemCard from "../components/ItemCard";
import ItemFilter from "../components/ItemFilter";
import { fetchItems } from "../api/itemApi";

const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ keyword: "", category: "", status: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { ...filters };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);
      const data = await fetchItems(params); // defaults to moderationStatus=approved
      setItems(data.items);
    } catch (err) {
      setError("Could not reach the backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div className="container">
      <h2>Browse Items</h2>
      <ItemFilter filters={filters} setFilters={setFilters} onSearch={loadItems} />

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No approved items found.</p>}

      <div className="grid">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default BrowseItems;
