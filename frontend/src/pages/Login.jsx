import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";
import Toast from "../components/Toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(formData);

      setToast({
        message: "Login successful!",
        type: "success",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setToast({
        message: "Invalid email or password",
        type: "error",
      });
    }

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <div className="auth-page">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="auth-wrapper">

        {/* LEFT BRAND PANEL */}
        <div className="auth-brand">
          <h2>EasyAppointments</h2>
          <p>
            Welcome back 👋 <br />
            Manage your appointments effortlessly with our secure and
            modern platform.
          </p>
        </div>

        {/* FORM */}
        <div className="auth-card">
          <h3>Welcome Back</h3>

          <form onSubmit={handleSubmit}>

            <div className="floating-input">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Email Address</label>
            </div>

            <div className="floating-input password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label>Password</label>

              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>

            <div className="forgot-wrapper">
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-primary-auth">
              Login
            </button>
          </form>

          <div className="auth-footer">
            Don’t have an account? <Link to="/register">Register</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
