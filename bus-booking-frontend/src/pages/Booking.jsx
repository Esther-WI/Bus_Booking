import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Booking.css";

const Booking = () => {
  const { id } = useParams(); // This should be the schedule_id
  const navigate = useNavigate();
  const [scheduleWithRoute, setScheduleWithRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    seats: 1,
    paymentMethod: "credit",
  });

  useEffect(() => {
    console.log('Current token:', localStorage.getItem('token'));
    const fetchScheduleWithRoute = async () => {
      try {
        const response = await api.get(`/api/schedules/${id}/route`);
        setScheduleWithRoute(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch schedule details");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleWithRoute();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      // Create booking for each seat
      const bookingPromises = [];
      for (let seatNum = 1; seatNum <= formData.seats; seatNum++) {
        bookingPromises.push(
          api.post("/api/bookings/", {
            schedule_id: Number(id),
            seat_number: seatNum,
            booking_status: "Pending",
            payment_status: "pending"
          })
        );
      }
  
      await Promise.all(bookingPromises);
      navigate("/bookings/my", { state: { success: true } });
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.response?.data?.error || "Booking failed. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!scheduleWithRoute) return <div className="not-found">Schedule not found</div>;

  return (
    <div className="booking-page">
      <h2>Book Your Trip</h2>
      <div className="booking-details">
        <h3>
          {scheduleWithRoute.route?.origin} to {scheduleWithRoute.route?.destination}
        </h3>
        <p>Departure: {new Date(scheduleWithRoute.departure_time).toLocaleString()}</p>
        <p>Arrival: {new Date(scheduleWithRoute.arrival_time).toLocaleString()}</p>
        <p>Price per seat: ${scheduleWithRoute.price_per_seat}</p>
        <p>Available seats: {scheduleWithRoute.available_seats}</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Number of Seats</label>
          <input
            type="number"
            name="seats"
            min="1"
            max={scheduleWithRoute.available_seats}
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
          <h4>Total: ${(scheduleWithRoute.price_per_seat * formData.seats).toFixed(2)}</h4>
        </div>
        <button 
          type="submit" 
          className="confirm-button"
          disabled={loading || formData.seats > scheduleWithRoute.available_seats}
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default Booking;