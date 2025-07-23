import { Link } from "react-router-dom";

const RouteCard = ({ route }) => {
  return (
    <div className="route-card">
      <div className="route-info">
        <h3>
          {route.from} to {route.to}
        </h3>
        <p>Departure: {route.departureTime}</p>
        <p>Arrival: {route.arrivalTime}</p>
        <p>Price: ${route.price}</p>
        <p>Available Seats: {route.availableSeats}</p>
      </div>
      <div className="route-actions">
        <Link to={`/booking/${route.id}`} className="book-button">
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default RouteCard;
