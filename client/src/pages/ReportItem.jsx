import React from "react";
import ItemForm from "../components/ItemForm";
import { createItem } from "../api/itemApi";

const ReportItem = () => {
  const handleSubmit = async (formData) => {
    await createItem(formData); // requires user to be logged in (token in localStorage)
  };

  return (
    <div className="container">
      <h2>Report a Lost/Found Item</h2>
      <p style={{ fontSize: 13, color: "#666" }}>
        Note: you must be logged in for this to work — the backend checks for a
        valid token in localStorage (key: "token").
      </p>
      <ItemForm onSubmit={handleSubmit} />
    </div>
  );
};

export default ReportItem;
