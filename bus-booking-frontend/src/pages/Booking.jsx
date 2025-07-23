import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    seats: 1,
    paymentMethod: "credit",
  });

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await api.get(`/routes/${id}`);
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
      await api.post("/bookings", {
        routeId: id,
        seats: formData.seats,
        paymentMethod: formData.paymentMethod,
      });
      navigate("/"); // Redirect to home after successful booking
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
          {route.from} to {route.to}
        </h3>
        <p>Departure: {route.departureTime}</p>
        <p>Arrival: {route.arrivalTime}</p>
        <p>Price per seat: ${route.price}</p>
        <p>Available seats: {route.availableSeats}</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Number of Seats</label>
          <input
            type="number"
            name="seats"
            min="1"
            max={route.availableSeats}
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
          <h4>Total: ${route.price * formData.seats}</h4>
        </div>
        <button type="submit" className="confirm-button">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default Booking;
