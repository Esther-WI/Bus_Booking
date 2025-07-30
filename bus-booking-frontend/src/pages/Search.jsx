import { useState, useEffect } from "react";
import RouteCard from "../components/RouteCard";
import SpecialOfferCard from "../components/SpecialOfferCard";
import api from "../utils/api";
import "./Search.css";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate()
  const [routes, setRoutes] = useState([]);
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
  });
  const [loading, setLoading] = useState({
    main: false,
    popular: false,
    offers: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPopularRoutes();
    fetchSpecialOffers();
  }, []);

  const fetchRoutes = async (params = {}) => {
    setLoading((prev) => ({ ...prev, main: true }));
    setError("");
    try {
      const response = await api.get("http://127.0.0.1:5000/api/routes/", {
        params: {
          ...params,
          include_schedules: true,
          include_buses: true
        }
      });
      setRoutes(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch routes");
    } finally {
      setLoading((prev) => ({ ...prev, main: false }));
    }
  };

  const fetchPopularRoutes = async () => {
    setLoading((prev) => ({ ...prev, popular: true }));
    try {
      const response = await api.get("http://127.0.0.1:5000/api/routes/popular", {
        params: { include_schedules: true }
      });
      setPopularRoutes(response.data);
    } catch (err) {
      console.error("Failed to fetch popular routes:", err);
    } finally {
      setLoading((prev) => ({ ...prev, popular: false }));
    }
  };

  const fetchSpecialOffers = async () => {
    setLoading((prev) => ({ ...prev, offers: true }));
    try {
      const response = await api.get("http://127.0.0.1:5000/api/offers/");
      setSpecialOffers(response.data);
    } catch (err) {
      console.error("Failed to fetch special offers:", err);
    } finally {
      setLoading((prev) => ({ ...prev, offers: false }));
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchParams.from || !searchParams.to) {
      setError("Please enter both departure and destination");
      return;
    }
    fetchRoutes(searchParams);
  };

  return (
    <div className="search-page">
      <div className="search-hero">
        <h2>Where would you like to go?</h2>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label>From</label>
              <input
                type="text"
                name="from"
                value={searchParams.from}
                onChange={handleSearchChange}
                placeholder="Departure city"
                required
              />
            </div>
            <div className="form-group">
              <label>To</label>
              <input
                type="text"
                name="to"
                value={searchParams.to}
                onChange={handleSearchChange}
                placeholder="Destination city"
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={searchParams.date}
                onChange={handleSearchChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <button type="submit" className="search-button">
              Search Buses
            </button>
          </div>
        </form>
      </div>

      <section className="search-results">
        <h2>Available Routes & Buses</h2>
        {loading.main && <div className="loading">Searching...</div>}
        {error && <div className="error-message">{error}</div>}

        {routes.length > 0 ? (
          <div className="routes-list">
            {routes.map((route) => (
              <div key={route.id} className="route-with-buses">
                <RouteCard route={route} />
                <div className="buses-list">
                  {route.buses?.map((bus) => (
                    <div key={bus.id} className="bus-card">
                      <h3>{bus.model} ({bus.registration_number})</h3>
                      <div className="bus-details">
                        <p>Capacity: {bus.capacity}</p>
                        <p>Status: {bus.status}</p>
                      </div>
                      <div className="bus-schedules">
                        {bus.schedules?.map((schedule) => (
                          <div key={schedule.id} className="schedule">
                            <p>Departure: {new Date(schedule.departure_time).toLocaleString()}</p>
                            <p>Arrival: {new Date(schedule.arrival_time).toLocaleString()}</p>
                            <p>Price: ${schedule.price_per_seat}</p>
                            <button className="book-btn"
                              onClick={() => navigate(`/booking/${schedule.id}`)}
                             >
                              Book Now
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading.main && (
            <div className="no-routes">
              <p>No routes found matching your criteria</p>
              <button 
                className="show-all-btn"
                onClick={() => fetchRoutes()}
              >
                Show all routes
              </button>
            </div>
          )
        )}
      </section>

      {!loading.offers && specialOffers.length > 0 && (
        <section className="special-offers-section">
          <h2>Special Offers</h2>
          <div className="offers-grid">
            {specialOffers.map((offer) => (
              <SpecialOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {!loading.popular && popularRoutes.length > 0 && (
        <section className="popular-routes-section">
          <h2>Popular Routes</h2>
          <div className="routes-grid">
            {popularRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Search;