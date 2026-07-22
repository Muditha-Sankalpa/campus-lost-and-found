import React from "react";

const categories = [
  "Electronics",
  "Documents",
  "Accessories",
  "Bags",
  "Clothing",
  "Keys",
  "Pets",
  "Others",
];

const ItemFilter = ({ filters, setFilters, onSearch }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      style={{ marginBottom: 16 }}
    >
      <input
        type="text"
        name="keyword"
        placeholder="Search title/description/location..."
        value={filters.keyword}
        onChange={handleChange}
      />{" "}
      <select name="category" value={filters.category} onChange={handleChange}>
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>{" "}
      <select name="status" value={filters.status} onChange={handleChange}>
        <option value="">All Status</option>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
        <option value="recovered">Recovered</option>
      </select>{" "}
      <button type="submit">Search</button>
    </form>
  );
};

export default ItemFilter;
