import { useEffect, useState } from "react";
import API from "../services/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

import "../styles/stats.css";

const COLORS = ["#2563eb", "#22c55e", "#ef4444", "#f59e0b"];

const monthNames = [
  "",
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/appointments/stats");
      setStats(res.data);
    } catch (err) {
      console.log("Analytics error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading analytics...</p>;
  if (!stats) return null;

  // ✅ Safe fallback arrays
  const monthlyBookings = stats.monthlyBookings || [];
  const monthlyRevenue = stats.monthlyRevenue || [];
  const revenueByCategory = stats.revenueByCategory || [];

  // 🔥 Format Monthly Booking Data
  const bookingData = monthlyBookings.map(item => ({
    month: monthNames[item._id],
    bookings: item.bookings
  }));

  // 🔥 Format Monthly Revenue Data
  const revenueData = monthlyRevenue.map(item => ({
    month: monthNames[item._id],
    revenue: item.revenue
  }));

  const pieData = [
    { name: "Approved", value: stats.approved },
    { name: "Pending", value: stats.pending },
    { name: "Cancelled", value: stats.cancelled },
    { name: "Completed", value: stats.completed }
  ];

  const totalRevenue = monthlyRevenue.reduce(
    (acc, cur) => acc + cur.revenue,
    0
  );

  return (
    <section className="analytics-page">

      <div className="analytics-header">
        <h2>Analytics Overview</h2>
        <p>Professional booking & revenue insights.</p>
      </div>

      {/* KPI CARDS */}
      <div className="analytics-grid">

        <div className="analytics-card">
          <h4>Total Bookings</h4>
          <p>{stats.total}</p>
        </div>

        <div className="analytics-card">
          <h4>Approved</h4>
          <p>{stats.approved}</p>
        </div>

        <div className="analytics-card">
          <h4>Total Revenue</h4>
          <p>${totalRevenue}</p>
        </div>

        <div className="analytics-card">
          <h4>Conversion Rate</h4>
          <p>
            {stats.total === 0
              ? 0
              : Math.round((stats.approved / stats.total) * 100)}%
          </p>
        </div>

      </div>

      {/* CHARTS */}
      <div className="charts-grid">

        {/* Monthly Bookings */}
        <div className="chart-card">
          <h3>Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div className="chart-card">
          <h3>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category */}
        <div className="chart-card">
          <h3>Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="chart-card">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={60}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </section>
  );
};

export default AdminStats;
