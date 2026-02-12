import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";
import Toast from "../components/Toast";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      await register(formData);

      setToast({
        message: "Account created successfully!",
        type: "success",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setToast({
        message: "Registration failed. Email may already exist.",
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

        <div className="auth-brand">
          <h2>EasyAppointments</h2>
          <p>
            Join thousands of businesses using our secure
            appointment management system.
          </p>
        </div>

        <div className="auth-card">
          <h3>Create Account</h3>

          <form onSubmit={handleSubmit}>

            <div className="floating-input">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label>Full Name</label>
            </div>

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

            <button type="submit" className="btn-primary-auth">
              Register
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
