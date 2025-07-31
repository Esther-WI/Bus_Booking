import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RouteCard from "../components/RouteCard";
import api from "../utils/api";


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
        // Check user role
        const roleResponse = await api.get("http://127.0.0.1:5000/api/auth/role");
        setUserRole(roleResponse.data.role);
        
        // Fetch popular routes
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
    <div className="popular-routes-page">
      <h2>Popular Routes</h2>
      
      {/* Only show button if user is admin */}
      {userRole === "Admin" && (
        <button 
          onClick={handleAddRouteClick}
          className="toggle-form-btn"
        >
          {showForm ? "Hide Form" : "Add New Route"}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="route-form">
          <h3>Create New Route</h3>
          <div className="form-group">
            <label>Origin:</label>
            <input
              type="text"
              name="origin"
              value={newRoute.origin}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Destination:</label>
            <input
              type="text"
              name="destination"
              value={newRoute.destination}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Distance (km):</label>
            <input
              type="number"
              name="distance"
              value={newRoute.distance}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Estimated Duration (minutes):</label>
            <input
              type="number"
              name="estimated_duration"
              value={newRoute.estimated_duration}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>
          <button type="submit" className="submit-btn">
            Create Route
          </button>
        </form>
      )}

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="routes-list">
        {routes.length > 0 ? (
          routes.map((route) => (
            <div key={route.id} className="route-with-schedules">
              {/* Route basic info */}
              <div className="route-summary">
                <h3>{route.origin} to {route.destination}</h3>
                <p>Distance: {route.distance} km</p>
                <p>Duration: {Math.floor(route.estimated_duration/60)}h {route.estimated_duration%60}m</p>
              </div>
              
              {/* Schedules for this route */}
              {route.schedules && route.schedules.length > 0 && (
                <div className="schedules-container">
                  <h4>Available Schedules:</h4>
                  {route.schedules.map((schedule) => (
                    <RouteCard 
                      key={schedule.id}
                      route={route}
                      schedule={schedule}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          !loading && <div className="no-routes">No popular routes found</div>
        )}
      </div>
    </div>
  );
};

export default PopularRoutes;