import { useEffect, useState } from "react";
import api from "../utils/api";
import SpecialOfferCard from "../components/SpecialOfferCard";
import CreateOfferForm from "../components/CreateOfferForm";
import "..pages/OffersPage.css";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check user role
        const roleResponse = await api.get("http://127.0.0.1:5000/api/auth/role");
        setUserRole(roleResponse.data.role);
        
        // Fetch offers
        const offersResponse = await api.get("http://127.0.0.1:5000/api/offers/");
        setOffers(offersResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewOffer = (newOffer) => {
    setOffers([newOffer, ...offers]);
    setShowForm(false);
  };

  return (
    <div className="offers-container">
      <div className="offers-header">
        <div className="header-content">
          <h1 className="page-title">Special Offers</h1>
          <p className="page-subtitle">Exclusive deals for your next journey</p>
        </div>
        
        {userRole === "Admin" && (
          <button 
            onClick={() => setShowForm(!showForm)}
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
                Create Offer
              </>
            )}
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-container">
          <CreateOfferForm onNewOffer={handleNewOffer} />
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Loading offers...</span>
        </div>
      ) : error ? (
        <div className="error-state">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
          </svg>
          <span>{error}</span>
        </div>
      ) : offers.length > 0 ? (
        <div className="offers-grid">
          {offers.map((offer) => (
            <SpecialOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="currentColor"/>
          </svg>
          <h3>No special offers available</h3>
          <p>Check back later for exciting deals</p>
        </div>
      )}
    </div>
  );
};

export default OffersPage;