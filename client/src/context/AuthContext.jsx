import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

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
    const headers = opts.headers || {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    const res = await fetch(url, { ...opts, headers });
    return res;
  };

  const loadUser = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, message: data.message || 'Register failed' };
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, message: data.message || 'Login failed' };
    } catch (err) {
      console.error('login error', err);
      return { ok: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // call server logout endpoint (no-op for stateless JWT) then clear local state
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
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
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        return { ok: true };
      }
      return { ok: false, message: data.message };
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
