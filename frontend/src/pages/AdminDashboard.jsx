import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/admin.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchRecent();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/appointments/stats");
      setStats(res.data);
    } catch (err) {
      console.log("Stats error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecent = async () => {
    try {
      const res = await API.get("/api/appointments?page=1&limit=5");
      setRecent(res.data.appointments || []);
    } catch (err) {
      console.log("Recent error");
    }
  };

  const calculateApprovalRate = () => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.approved / stats.total) * 100);
  };

  return (
    <section className="admin-dashboard">

      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Monitor platform performance and business insights.</p>
      </div>

      {loading && <p>Loading...</p>}

      {stats && (
        <>
          {/* ================= KPI CARDS ================= */}
          <div className="kpi-grid">

            <div className="kpi-card">
              <div className="kpi-title">Total Bookings</div>
              <div className="kpi-value">{stats.total}</div>
              <div className="kpi-trend positive">+12% this month</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-title">Approval Rate</div>
              <div className="kpi-value">{calculateApprovalRate()}%</div>
              <div className="kpi-trend positive">Improving</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-title">Pending</div>
              <div className="kpi-value">{stats.pending}</div>
              <div className="kpi-trend warning">Needs attention</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-title">Completed</div>
              <div className="kpi-value">{stats.completed}</div>
              <div className="kpi-trend neutral">Stable</div>
            </div>

          </div>

          {/* ================= RECENT BOOKINGS ================= */}
          <div className="recent-section">
            <h3>Recent Appointments</h3>

            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recent.map((appt) => (
                  <tr key={appt._id}>
                    <td>{appt.user?.name}</td>
                    <td>{appt.service?.name}</td>
                    <td>{appt.date}</td>
                    <td>
                      <span className={`status-badge ${appt.status}`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </>
      )}
    </section>
  );
};

export default AdminDashboard;
