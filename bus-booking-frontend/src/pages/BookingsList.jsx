import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/api/bookings/my");
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
      const response = await api.patch(`/api/bookings/${id}/cancel`);
      setBookings(bookings.map(b => 
        b.id === id ? { ...b, booking_status: "Cancelled" } : b
      ));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to cancel booking");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/bookings/${id}`);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete booking");
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
                  {booking.schedule?.origin} to {booking.schedule?.destination}
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