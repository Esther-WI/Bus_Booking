import { useState, useEffect } from "react";
import RouteCard from "../components/RouteCard";
import api from "../utils/api";

const PopularRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        const response = await api.get("/routes/popular");
        setRoutes(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch popular routes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPopularRoutes();
  }, []);

  return (
    <div className="popular-routes-page">
      <h2>Popular Routes</h2>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="routes-list">
        {routes.length > 0
          ? routes.map((route) => <RouteCard key={route.id} route={route} />)
          : !loading && (
              <div className="no-routes">No popular routes found</div>
            )}
      </div>
    </div>
  );
};

export default PopularRoutes;
