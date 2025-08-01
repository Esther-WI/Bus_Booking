import { Link } from "react-router-dom";
import React from "react";
import "../components/Routecard.css"

const RouteCard = ({ route, schedule }) => {
  return (
    <div className="route-card">
      <div className="route-info">
        <div className="route-header">
          <div className="route-cities">
            <span className="origin">{route.origin}</span>
            <div className="route-arrow">→</div>
            <span className="destination">{route.destination}</span>
          </div>
          <div className="route-price">
            {schedule ? `Ksh ${schedule.price_per_seat.toLocaleString()}` : '--'}
          </div>
        </div>

        {schedule ? (
          <div className="schedule-details">
            <div className="time-details">
              <div className="time-group">
                <span className="time-label">Departure</span>
                <span className="time-value">
                  {new Date(schedule.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="time-date">
                  {new Date(schedule.departure_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="time-group">
                <span className="time-label">Arrival</span>
                <span className="time-value">
                  {new Date(schedule.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="time-date">
                  {new Date(schedule.arrival_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="seats-available">
              <span className="seats-label">Available Seats</span>
              <span className={`seats-count ${schedule.available_seats < 10 ? 'low-availability' : ''}`}>
                {schedule.available_seats}
              </span>
            </div>
          </div>
        ) : (
          <div className="no-schedule">No schedule available</div>
        )}
      </div>

      <div className="route-actions">
        <Link
          to={`/booking/${route.id}${schedule ? `?schedule=${schedule.id}` : ''}`}
          className={`book-button ${!schedule ? 'disabled' : ''}`}
        >
          {schedule ? "Book Now" : "Check Availability"}
        </Link>
      </div>
    </div>
  );
};

export default RouteCard;