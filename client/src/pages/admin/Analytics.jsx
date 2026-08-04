import { useState, useEffect, useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import AuthContext from "../../context/AuthContext";
import "../../styles/admin/Analytics.css";
import "../../styles/admin/AdminPage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ROLE_COLORS = {
  student: "#6b3aa0",
  moderator: "#c9a227",
  admin: "#2e1148",
};

const TYPE_COLORS = {
  info: "#6b3aa0",
  warning: "#d59f2b",
  urgent: "#b02525",
};

function Analytics() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (res.ok) setData(json);
        else setError(json.message || "Failed to load analytics");
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  if (loading) return <div className="admin-page"><p>Loading analytics…</p></div>;
  if (error) return <div className="admin-page"><div className="an-error">{error}</div></div>;

  // Format signup dates for the chart (show only day and month)
  const signupChartData = data.signupsByDay.map((d) => ({
    date: d.date.slice(5),
    signups: d.count,
  }));

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">Analytics</h1>
        <p className="admin-page__subtitle">
          User growth, role distribution, and platform activity over time.
        </p>
      </header>

      <div className="an-grid">
        {/* Users by role — donut */}
        <div className="an-card">
          <h2 className="an-card__title">Users by Role</h2>
          {data.usersByRole.length === 0 ? (
            <p className="an-empty">No user data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.usersByRole}
                  dataKey="count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                  label={({ role, count }) => `${role} (${count})`}
                >
                  {data.usersByRole.map((entry) => (
                    <Cell key={entry.role} fill={ROLE_COLORS[entry.role] || "#999"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Announcements by type — bar */}
        <div className="an-card">
          <h2 className="an-card__title">Announcements by Type</h2>
          {data.announcementsByType.length === 0 ? (
            <p className="an-empty">No announcements yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.announcementsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e5" />
                <XAxis dataKey="type" tick={{ fill: "#6b6b6b", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#6b6b6b", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.announcementsByType.map((entry) => (
                    <Cell key={entry.type} fill={TYPE_COLORS[entry.type] || "#6b3aa0"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Signups over time — line, full width */}
        <div className="an-card an-card--wide">
          <h2 className="an-card__title">New Users — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={signupChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e5" />
              <XAxis dataKey="date" tick={{ fill: "#6b6b6b", fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#6b6b6b", fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="signups"
                stroke="#4b1e73"
                strokeWidth={3}
                dot={{ fill: "#c9a227", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="an-note">
        <strong>Coming soon:</strong> item categories, recovery rates, and moderation stats —
        available once the Items and Moderation modules are integrated.
      </div>
    </div>
  );
}

export default Analytics;