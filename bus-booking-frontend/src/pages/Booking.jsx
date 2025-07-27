import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Booking.css"; // Assuming you have a CSS file for styling

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    seats: 1,
    paymentMethod: "credit",
    schedule_id: null,
  });

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await api.get(`http://127.0.0.1:5000/api/schedules/${id}`);
        setRoute(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch route details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("http://127.0.0.1:5000/api/bookings", {
        schedule_id: id,
        seats: Number(formData.seats),
        paymentMethod: formData.paymentMethod,
      });
      navigate("/bookings");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!route) return <div className="not-found">Route not found</div>;

  return (
    <div className="booking-page">
      <h2>Book Your Trip</h2>
      <div className="booking-details">
        <h3>
          {route.origin} to {route.destination}
        </h3>
        <p>Departure: {schedule.departure_time}</p>
        <p>Arrival: {schedule.arrival_time}</p>
        <p>Price per seat: ${schedule.price_per_seat}</p>
        <p>Available seats: {schedule.available_seats}</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Number of Seats</label>
          <input
            type="number"
            name="seats"
            min="1"
            max={schedule.available_seats}
            value={formData.seats}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        <div className="price-summary">
          <h4>Total: ${schedule.price_per_seat * formData.seats}</h4>
        </div>
        <button type="submit" className="confirm-button">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default Booking;
