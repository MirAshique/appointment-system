import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/adminLayout.css";

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>EasyAdmin</h2>
          <p>Super Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className={isActive("/admin/dashboard") ? "active" : ""}>
            📊 Dashboard
          </Link>

          <Link to="/admin/appointments" className={isActive("/admin/appointments") ? "active" : ""}>
            📅 Appointments
          </Link>

          <Link to="/admin/stats" className={isActive("/admin/stats") ? "active" : ""}>
            📈 Analytics
          </Link>

          <Link to="/admin/services" className={isActive("/admin/services") ? "active" : ""}>
            🛠 Services
          </Link>

          <Link to="/admin/categories" className={isActive("/admin/categories") ? "active" : ""}>
            🗂 Categories
          </Link>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* CONTENT */}
      <div className="admin-main">
        
        {/* TOP HEADER */}
        <div className="admin-topbar">
          <div className="topbar-left">
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
