import { useState, useEffect } from "react";
import RouteCard from "../components/RouteCard";
import SpecialOfferCard from "../components/SpecialOfferCard";
import api from "../utils/api";
import "./Search.css"; // Assuming you have a CSS file for styling

const Search = () => {
  const [busSearchQuery, setBusSearchQuery] = useState("");
  const [busResults, setBusResults] = useState([]);
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
      const response = await api.get("/routes", { params });
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
      const response = await api.get("/routes/popular");
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
      const response = await api.get("/offers");
      setSpecialOffers(response.data);
    } catch (err) {
      console.error("Failed to fetch special offers:", err);
    } finally {
      setLoading((prev) => ({ ...prev, offers: false }));
    }
  };

  const fetchBusResults = async (query) => {
    try {
      const response = await api.get("/buses/search", {
        params: { model: query, registration_number: query },
      });
      setBusResults(response.data);
    } catch (err) {
      console.error("Bus search failed:", err);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
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
            <div className="form-row">
              <input
                type="text"
                placeholder="Search by model or reg number"
                onChange={(e) => setBusSearchQuery(e.target.value)}
              />
                {busResults.length > 0 && (
                    <div className="bus-search-results">
                      <h3>Bus Results</h3>
                      <ul>
                        {busResults.map((bus) => (
                          <li key={bus.id}>
                            {bus.registration_number} - {bus.model} (Capacity: {bus.capacity})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              <button onClick={() => fetchBusResults(busSearchQuery)}>
                Search Buses
              </button>
            </div>
          </div>
        </form>
      </div>

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

      <section className="search-results">
        <h2>Available Routes</h2>
        {loading.main && <div className="loading">Searching for routes...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="routes-list">
          {routes.length > 0
            ? routes.map((route) => <RouteCard key={route.id} route={route} />)
            : !loading.main && (
                <div className="no-routes">
                  <p>No routes found matching your criteria</p>
                  <button onClick={() => fetchRoutes()}>Show all routes</button>
                </div>
              )}
        </div>
      </section>
    </div>
  );
};

export default Search;
