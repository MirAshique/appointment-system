import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/appointments.css";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/appointments?page=1&limit=50");
      const data = res.data.appointments || res.data;
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/api/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err) {
      alert("Status update failed");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 🔎 SEARCH + FILTER LOGIC
  useEffect(() => {
    let data = [...appointments];

    if (search) {
      data = data.filter(
        (appt) =>
          appt.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          appt.service?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((appt) => appt.status === statusFilter);
    }

    setFilteredAppointments(data);
    setCurrentPage(1);
  }, [search, statusFilter, appointments]);

  // 📄 Pagination Logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
const downloadCSV = () => {
  if (!filteredAppointments.length) return;

  const headers = [
    "Customer",
    "Service",
    "Date",
    "Time",
    "Status",
    "Payment"
  ];

  const rows = filteredAppointments.map((appt) => [
    appt.user?.name,
    appt.service?.name,
    appt.date,
    appt.time,
    appt.status,
    appt.paymentStatus || "Paid"
  ]);

  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "appointments.csv");
  document.body.appendChild(link);
  link.click();
};

  return (
    <section className="admin-page">
      <div className="admin-header">
        <h2>Manage Appointments</h2>
        <p>Review and update booking statuses.</p>
      </div>

      {/* 🔥 SEARCH + FILTER BAR */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="🔍 Search by customer or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading && <div className="loading">Loading appointments...</div>}
      {error && <div className="error">{error}</div>}

      {filteredAppointments.length > 0 && (
        <>
        <div className="export-bar">
  <button className="btn btn-primary" onClick={downloadCSV}>
    ⬇ Download CSV
  </button>
</div>

          <div className="table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{appt.user?.name}</td>
                    <td>{appt.service?.name}</td>
                    <td>{appt.date?.slice(0, 10)}</td>
                    <td>{appt.time}</td>
                    <td>
                      <span className={`status-badge ${appt.status}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge approved">
                        {appt.paymentStatus || "Paid"}
                      </span>
                    </td>
                    <td>
                      {appt.status === "pending" && (
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            updateStatus(appt._id, "approved")
                          }
                        >
                          Approve
                        </button>
                      )}

                      {appt.status === "approved" && (
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            updateStatus(appt._id, "completed")
                          }
                        >
                          Complete
                        </button>
                      )}

                      {appt.status !== "cancelled" &&
                        appt.status !== "completed" && (
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              updateStatus(appt._id, "cancelled")
                            }
                          >
                            Cancel
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📄 Pagination UI */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={
                  currentPage === index + 1 ? "active-page" : ""
                }
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {filteredAppointments.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No Appointments Found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      )}
    </section>
  );
};

export default ManageAppointments;
