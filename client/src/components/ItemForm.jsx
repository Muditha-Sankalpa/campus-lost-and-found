import React, { useState, useEffect } from "react";

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

const emptyForm = {
  title: "",
  description: "",
  category: "Others",
  location: "",
  status: "lost",
  contactInfo: "",
};

// Plain, non-modal form. Used inline on the ReportItem page,
// and reused on MyItems for editing (rendered inline there too).
const ItemForm = ({ initialItem, onSubmit, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialItem) {
      setForm({
        title: initialItem.title || "",
        description: initialItem.description || "",
        category: initialItem.category || "Others",
        location: initialItem.location || "",
        status: initialItem.status || "lost",
        contactInfo: initialItem.contactInfo || "",
      });
    }
  }, [initialItem]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImages(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    images.forEach((file) => formData.append("images", file));

    try {
      await onSubmit(formData, initialItem?._id);
      setMessage("Success!");
      if (!initialItem) setForm(emptyForm); // reset after a fresh report
    } catch (err) {
      setMessage(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div>
        <label>Title</label><br />
        <input type="text" name="title" value={form.title} onChange={handleChange} required style={{ width: "100%" }} />
      </div>
      <div>
        <label>Description</label><br />
        <textarea name="description" value={form.description} onChange={handleChange} required rows={3} style={{ width: "100%" }} />
      </div>
      <div>
        <label>Category</label><br />
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Status</label><br />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
          <option value="recovered">Recovered</option>
        </select>
      </div>
      <div>
        <label>Location</label><br />
        <input type="text" name="location" value={form.location} onChange={handleChange} required style={{ width: "100%" }} />
      </div>
      <div>
        <label>Contact Info (optional)</label><br />
        <input type="text" name="contactInfo" value={form.contactInfo} onChange={handleChange} style={{ width: "100%" }} />
      </div>
      <div>
        <label>Images (up to 5)</label><br />
        <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      </div>

      <div style={{ marginTop: 10 }}>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : initialItem ? "Update Item" : "Submit Report"}
        </button>{" "}
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>

      {message && <p style={{ marginTop: 8 }}>{message}</p>}
    </form>
  );
};

export default ItemForm;
