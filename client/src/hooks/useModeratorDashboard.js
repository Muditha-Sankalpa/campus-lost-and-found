import { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function useModeratorDashboard() {
  const { token } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/admin/moderator/dashboard`, {
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });
    const data = await res.json();
    if (res.ok) setDashboard(data);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { dashboard, loading, reload };
}
