import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./BookingsList.css";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("http://127.0.0.1:5000/api/bookings/my");
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      const response = await api.patch(`http://127.0.0.1:5000/api/bookings/${id}/cancel`);
      setBookings(bookings.map(b => 
        b.id === id ? { ...b, booking_status: "Cancelled" } : b
      ));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to cancel booking");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`http://127.0.0.1:5000/api/bookings/${id}`);
      setBookings(bookings.filter(b => b.id !== id));
      setSuccess("Booking deleted successfully");
      setTimeout(() => {
        setSuccess("");
        navigate(""); // Redirect to homepage after 2 seconds
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  {`${booking.schedule?.route?.origin} to ${booking.schedule?.route?.destination}`}
                  <br />
                  <small>
                    {new Date(booking.schedule?.departure_time).toLocaleString()}
                  </small>
                </td>
                <td>{booking.seat_number}</td>
                <td className={`status-${booking.booking_status.toLowerCase()}`}>
                  {booking.booking_status}
                </td>
                <td>
                  {booking.booking_status !== "Cancelled" && (
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(booking.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingsList;