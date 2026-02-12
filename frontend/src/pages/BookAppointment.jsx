import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/book.css";

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      setError("Date and Time are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // 🔥 Fake payment delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      await API.post("/api/appointments", {
        serviceId: id,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
      });

      setSuccess("Payment Successful! Appointment Booked 🎉");

      setTimeout(() => {
        navigate("/my-appointments");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-container">
      <div className="book-card">
        <h2>Pay & Book Appointment</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />

          <textarea
            name="notes"
            placeholder="Additional notes (optional)"
            value={formData.notes}
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-primary">
            {loading ? "Processing Payment..." : "Pay & Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
