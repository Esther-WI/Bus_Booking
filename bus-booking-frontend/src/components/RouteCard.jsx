import { Link } from "react-router-dom";
import React from "react";
import "../components/Routecard.css";

const RouteCard = ({ route, schedule, onClick }) => {

  const hasSchedules = route.schedules && route.schedules.length > 0;
  return (
    <div className="route-card" onClick={onClick}>
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
        ) : hasSchedules ? (
          <p>Select a specific schedule to view details</p>
        ) :
        (
          <p>No schedule available</p>
        )}
      </div>
      <div className="route-actions">
        <Link 
          to={`/booking/${route.id}${schedule ? `?schedule=${schedule.id}` : ''}`} 
          className="book-button"
          disabled={!schedule}
        >
          {schedule ? "Book Now" : "view schedules"}
        </Link>
      </div>
    </div>
  );
};

export default RouteCard;