import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "../styles/adminLayout.css";

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>EasyAdmin</h2>
          <p>Super Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/admin/dashboard"
            className={isActive("/admin/dashboard") ? "active" : ""}
            onClick={() => setSidebarOpen(false)}
          >
            📊 Dashboard
          </Link>

          <Link
            to="/admin/appointments"
            className={isActive("/admin/appointments") ? "active" : ""}
            onClick={() => setSidebarOpen(false)}
          >
            📅 Appointments
          </Link>

          <Link
            to="/admin/stats"
            className={isActive("/admin/stats") ? "active" : ""}
            onClick={() => setSidebarOpen(false)}
          >
            📈 Analytics
          </Link>

          <Link
            to="/admin/services"
            className={isActive("/admin/services") ? "active" : ""}
            onClick={() => setSidebarOpen(false)}
          >
            🛠 Services
          </Link>

          <Link
            to="/admin/categories"
            className={isActive("/admin/categories") ? "active" : ""}
            onClick={() => setSidebarOpen(false)}
          >
            🗂 Categories
          </Link>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className="admin-main">

        <div className="admin-topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h3>Admin Panel — Super Admin</h3>
          </div>

          <div className="topbar-right">
            <span className="notification">🔔</span>
            <div className="admin-profile">
              <div className="avatar-circle">
                {user?.name?.charAt(0) || "A"}
              </div>
              <span className="admin-name">
                {user?.name || "Admin"}
              </span>
            </div>
          </div>
        </div>

        <main className="admin-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
