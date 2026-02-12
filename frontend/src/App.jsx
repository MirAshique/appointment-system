import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminServices from "./pages/AdminServices";

// User Pages
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminStats from "./pages/AdminStats";
import ManageAppointments from "./pages/ManageAppointments";

import AdminCategories from "./pages/AdminCategories";

/* ================= PUBLIC LAYOUT ================= */
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= CUSTOMER ROUTES ================= */}
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute role="customer">
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute role="customer">
              <MyAppointments />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="appointments" element={<ManageAppointments />} />
        <Route path="stats" element={<AdminStats />} />
        <Route path="services" element={<AdminServices />} />
<Route path="categories" element={<AdminCategories />} />
      </Route>

    </Routes>
  );
}

export default App;
