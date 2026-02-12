import { useEffect, useState } from "react";
import API from "../services/api";
import Toast from "../components/Toast";
import "../styles/appointments.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/api/appointments/my?page=1&limit=5");
      setAppointments(res.data.appointments || res.data);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.delete(`/api/appointments/${id}`);

      setToast({
        message: "Appointment cancelled successfully",
        type: "success",
      });

      fetchAppointments();
    } catch (err) {
      setToast({
        message: "Cancel failed",
        type: "error",
      });
    }

    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <section className="appointments-section">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="container">
        <div className="appointments-header">
          <h2>My Appointments</h2>
          <p>Track and manage your scheduled services easily.</p>
        </div>

        {loading && <div className="loading">Loading appointments...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && appointments.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No Appointments Yet</h3>
            <p>You haven’t booked any appointments yet.</p>
          </div>
        )}

        {appointments.length > 0 && (
          <div className="table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{appt.service?.name}</td>
                    <td>{appt.date?.slice(0, 10)}</td>
                    <td>{appt.time}</td>
                    <td>
                      <span className={`status-badge ${appt.status}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td>
                      <span className="badge paid">
                        {appt.paymentStatus || "Paid"}
                      </span>
                    </td>
                    <td>
                      {appt.status === "pending" ? (
                        <button
                          className="btn btn-danger cancel-btn"
                          onClick={() => handleCancel(appt._id)}
                        >
                          Cancel
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAppointments;
