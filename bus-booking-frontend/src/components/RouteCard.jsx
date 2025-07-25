import { Link } from "react-router-dom";
import React from "react";
import "../components/Routecard.css"; // Assuming you have a CSS file for styling

const RouteCard = ({ route }) => {
  return (
    <div className="route-card">
      <div className="route-info">
        <h3>
          {route.origin} to {route.destination}
        </h3>
        <p>Departure: {schedule.departure_time}</p>
        <p>Arrival: {schedule.arrival_time}</p>
        <p>Price: ${schedule.price_per_seat}</p>
        <p>Available Seats: {schedule.available_seats}</p>
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
