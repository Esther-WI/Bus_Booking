import { useState, useEffect } from "react";
import RouteCard from "../components/RouteCard";
import SpecialOfferCard from "../components/SpecialOfferCard";
import api from "../utils/api";
import "./Search.css";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
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
    <div className="search-container">
      {/* Hero Search Section */}
      <div className="search-hero">
        <div className="hero-content">
          <h2 className="hero-title">Where would you like to go?</h2>
          <p className="hero-subtitle">Find the perfect bus for your journey</p>
          
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">From</label>
                <input
                  type="text"
                  name="from"
                  value={searchParams.from}
                  onChange={handleSearchChange}
                  placeholder="e.g. Nairobi"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">To</label>
                <input
                  type="text"
                  name="to"
                  value={searchParams.to}
                  onChange={handleSearchChange}
                  placeholder="e.g. Mombasa"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={searchParams.date}
                  onChange={handleSearchChange}
                  className="form-input"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              
              <button type="submit" className="search-button">
                {loading.main ? (
                  <span className="search-spinner"></span>
                ) : (
                  "Search Buses"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="search-content">
        {/* Search Results */}
        <section className="search-results-section">
          <div className="section-header">
            <h3 className="section-title">Available Routes & Buses</h3>
            <button 
              className="show-all-button"
              onClick={() => fetchRoutes()}
            >
              Show All Routes
            </button>
          </div>

          {loading.main && (
            <div className="loading-state">
              <div className="spinner"></div>
              <span>Searching for routes...</span>
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

          {routes.length > 0 ? (
            <div className="routes-container">
              {routes.map((route) => (
                <div key={route.id} className="route-card">
                  <RouteCard route={route} />
                  
                  {route.buses?.length > 0 && (
                    <div className="buses-container">
                      <h4 className="buses-title">Available Buses</h4>
                      <div className="buses-grid">
                        {route.buses.map((bus) => (
                          <div key={bus.id} className="bus-card">
                            <div className="bus-header">
                              <h5 className="bus-model">{bus.model}</h5>
                              <span className="bus-registration">{bus.registration_number}</span>
                            </div>
                            
                            <div className="bus-details">
                              <div className="detail-item">
                                <span className="detail-label">Capacity</span>
                                <span className="detail-value">{bus.capacity}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Status</span>
                                <span className={`status-badge ${bus.status.toLowerCase()}`}>
                                  {bus.status}
                                </span>
                              </div>
                            </div>
                            
                            {bus.schedules?.length > 0 && (
                              <div className="schedules-container">
                                <h6 className="schedules-title">Departure Times</h6>
                                <div className="schedules-list">
                                  {bus.schedules.map((schedule) => (
                                    <div key={schedule.id} className="schedule-card">
                                      <div className="time-info">
                                        <div className="time-group">
                                          <span className="time-label">Departure</span>
                                          <span className="time-value">
                                            {new Date(schedule.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        </div>
                                        <div className="time-group">
                                          <span className="time-label">Arrival</span>
                                          <span className="time-value">
                                            {new Date(schedule.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="price-info">
                                        <span className="price-label">Price</span>
                                        <span className="price-value">Ksh {schedule.price_per_seat.toLocaleString()}</span>
                                      </div>
                                      <button 
                                        className="book-button"
                                        onClick={() => navigate(`/booking/${schedule.id}`)}
                                      >
                                        Book Now
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !loading.main && (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="currentColor"/>
                </svg>
                <h4>No routes found</h4>
                <p>Try adjusting your search criteria</p>
              </div>
            )
          )}
        </section>

        {/* Special Offers Section */}
        {!loading.offers && specialOffers.length > 0 && (
          <section className="offers-section">
            <div className="section-header">
              <h3 className="section-title">Special Offers</h3>
            </div>
            <div className="offers-grid">
              {specialOffers.map((offer) => (
                <SpecialOfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </section>
        )}

        {/* Popular Routes Section */}
        {!loading.popular && popularRoutes.length > 0 && (
          <section className="popular-section">
            <div className="section-header">
              <h3 className="section-title">Popular Routes</h3>
            </div>
            <div className="routes-grid">
              {popularRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Search;