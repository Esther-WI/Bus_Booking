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
        const roleResponse = await api.get("/auth/role");
        setUserRole(roleResponse.data.role);
        
        // Fetch popular routes
        const routesResponse = await api.get("/routes/popular");
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
      const response = await api.post("/routes", newRoute);
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
          routes.map((route) => <RouteCard key={route.id} route={route} />)
        ) : (
          !loading && <div className="no-routes">No popular routes found</div>
        )}
      </div>
    </div>
  );
};

export default PopularRoutes;