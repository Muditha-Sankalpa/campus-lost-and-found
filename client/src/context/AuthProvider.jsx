import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Set backend base URL via Vite env: VITE_API_BASE_URL. Fallback to localhost:5000
const API_BASE = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:5000';

async function parseJSONSafe(res) {
  try {
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      loadUser();
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const apiFetch = async (url, opts = {}) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
    const headers = { ...(opts.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(fullUrl, { ...opts, headers });
    return res;
  };

  const loadUser = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/me');
      if (res.ok) {
        const data = await parseJSONSafe(res);
        if (data && data.user) setUser(data.user);
        else setUser(null);
      } else {
        // token invalid or expired
        setToken(null);
      }
    } catch (err) {
      console.error('loadUser error', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await parseJSONSafe(res);
      if (res.ok && data && data.token) {
        setToken(data.token);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, message: (data && data.message) || `Register failed (status ${res.status})` };
    } catch (err) {
      console.error('register error', err);
      return { ok: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await parseJSONSafe(res);
      if (res.ok && data && data.token) {
        setToken(data.token);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, message: (data && data.message) || `Login failed (status ${res.status})` };
    } catch (err) {
      console.error('login error', err);
      return { ok: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      // ignore
    }
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/me', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      const data = await parseJSONSafe(res);
      if (res.ok && data && data.user) {
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, message: (data && data.message) || `Update failed (status ${res.status})` };
    } catch (err) {
      console.error('updateProfile error', err);
      return { ok: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, loadUser, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
