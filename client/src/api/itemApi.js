import axios from "axios";

const API_BASE = import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET /api/items?keyword=&category=&status=&page=&limit=
export const fetchItems = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/items`, { params });
  return res.data;
};

export const fetchItemById = async (id) => {
  const res = await axios.get(`${API_BASE}/items/${id}`);
  return res.data;
};

// GET /api/items/mine - logged-in user's own reports, any moderation status
export const fetchMyItems = async () => {
  const res = await axios.get(`${API_BASE}/items/mine`, { headers: authHeader() });
  return res.data;
};

// formData should include title, description, category, location, status, contactInfo, images (files)
export const createItem = async (formData) => {
  const res = await axios.post(`${API_BASE}/items`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeader(),
    },
  });
  return res.data;
};

export const updateItem = async (id, formData) => {
  const res = await axios.put(`${API_BASE}/items/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeader(),
    },
  });
  return res.data;
};

export const deleteItem = async (id) => {
  const res = await axios.delete(`${API_BASE}/items/${id}`, {
    headers: authHeader(),
  });
  return res.data;
};
