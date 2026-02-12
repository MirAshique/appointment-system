import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar only on admin routes
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h2 className="logo">
          <Link to="/">EasyAppointments</Link>
        </h2>

        <div className="nav-links">

          {!user && (
            <>
              <Link to="/">Home</Link>
              <Link to="/services">Services</Link>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}

          {user && user.role === "customer" && (
            <>
              <Link to="/">Home</Link>
              <Link to="/services">Services</Link>
              <Link to="/my-appointments">My Appointments</Link>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
