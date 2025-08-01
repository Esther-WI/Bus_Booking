import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RouteCard from "../components/RouteCard";
import api from "../utils/api";
import "../pages/PopularRoutes.css"

const PopularRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newRoute, setNewRoute] = useState({
    origin: "",
    destination: "",
    distance: "",
    estimated_duration: ""
  });
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleResponse = await api.get("http://127.0.0.1:5000/api/auth/role");
        setUserRole(roleResponse.data.role);
        
        const routesResponse = await api.get("http://127.0.0.1:5000/api/routes/popular");
        setRoutes(routesResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoute(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRouteClick = () => {
    if (userRole === "Admin") {
      setShowForm(true);
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const numericData = {
        ...newRoute,
        distance: parseFloat(newRoute.distance),
        estimated_duration: parseInt(newRoute.estimated_duration)
      };
  
      const response = await api.post("http://127.0.0.1:5000/api/routes/", numericData);
      setRoutes([response.data, ...routes]);
      setShowForm(false);
      setNewRoute({
        origin: "",
        destination: "",
        distance: "",
        estimated_duration: ""
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create route");
    }
  };

  return (
    <div className="popular-routes-container">
      <div className="popular-routes-header">
        <h2 className="page-title">Popular Routes</h2>
        
        {userRole === "Admin" && (
          <button 
            onClick={handleAddRouteClick}
            className={`admin-button ${showForm ? 'cancel' : 'add'}`}
          >
            {showForm ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
                </svg>
                Add Route
              </>
            )}
          </button>
        )}
      </div>

      {showForm && (
        <div className="route-form-container">
          <form onSubmit={handleSubmit} className="route-form">
            <h3 className="form-title">Create New Route</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Origin</label>
                <input
                  type="text"
                  name="origin"
                  value={newRoute.origin}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="e.g. Nairobi"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={newRoute.destination}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="e.g. Mombasa"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Distance (km)</label>
                <input
                  type="number"
                  name="distance"
                  value={newRoute.distance}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  min="1"
                  placeholder="e.g. 480"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Duration (mins)</label>
                <input
                  type="number"
                  name="estimated_duration"
                  value={newRoute.estimated_duration}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  min="1"
                  placeholder="e.g. 300"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-button">
                Create Route
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Loading routes...</span>
        </div>
      )}

      {error && (
        <div className="error-state">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="routes-grid">
        {routes.length > 0 ? (
          routes.map((route) => (
            <div key={route.id} className="route-card-container">
              <div className="route-header">
                <div className="route-title">
                  <h3>
                    <span className="origin">{route.origin}</span>
                    <span className="arrow">→</span>
                    <span className="destination">{route.destination}</span>
                  </h3>
                  <div className="route-meta">
                    <span className="distance">{route.distance} km</span>
                    <span className="duration">
                      {Math.floor(route.estimated_duration/60)}h {route.estimated_duration%60}m
                    </span>
                  </div>
                </div>
              </div>
              
              {route.schedules && route.schedules.length > 0 ? (
                <div className="schedules-list">
                  <h4 className="schedules-title">Available Departures</h4>
                  {route.schedules.map((schedule) => (
                    <RouteCard 
                      key={schedule.id}
                      route={route}
                      schedule={schedule}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-schedules">
                  No schedules available for this route
                </div>
              )}
            </div>
          ))
        ) : (
          !loading && (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="currentColor"/>
              </svg>
              <h3>No popular routes found</h3>
              <p>Check back later for available routes</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PopularRoutes;