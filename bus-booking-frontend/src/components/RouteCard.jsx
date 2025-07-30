import { Link } from "react-router-dom";
import React from "react";
import "../components/Routecard.css";

const RouteCard = ({ route, schedule }) => {
  return (
    <div className="route-card">
      <div className="route-info">
        <h3>
          {route.origin} to {route.destination}
        </h3>
        {schedule ? (
          <>
            <p>Departure: {new Date(schedule.departure_time).toLocaleString()}</p>
            <p>Arrival: {new Date(schedule.arrival_time).toLocaleString()}</p>
            <p>Price: Ksh {schedule.price_per_seat}</p>
            <p>Available Seats: {schedule.available_seats}</p>
          </>
        ) : (
          <p>No schedule available</p>
        )}
      </div>
      <div className="route-actions">
        <Link 
          to={`/booking/${route.id}${schedule ? `?schedule=${schedule.id}` : ''}`} 
          className="book-button"
          disabled={!schedule}
        >
          {schedule ? "Book Now" : "Check Availability"}
        </Link>
      </div>
    </div>
  );
};

export default RouteCard;