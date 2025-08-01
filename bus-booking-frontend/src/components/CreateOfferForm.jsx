import { useState } from "react";
import api from "../utils/api";
import "../components/CreateOfferForm.css";

const CreateOfferForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    terms: ""
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await api.post("http://127.0.0.1:5000/offers/", formData);
      setMessage("Offer created successfully!");
      setFormData({
        title: "",
        description: "",
        discount: "",
        terms: ""
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="offer-form-container">
      <div className="offer-form-card">
        <h2 className="offer-form-title">Create Special Offer</h2>
        <p className="offer-form-subtitle">Attract customers with exclusive deals</p>
        
        <form onSubmit={handleSubmit} className="offer-form">
          <div className="form-group">
            <label htmlFor="title">Offer Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Summer Special"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your offer in detail..."
              value={formData.description}
              onChange={handleChange}
              required
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="discount">Discount*</label>
              <input
                type="text"
                id="discount"
                name="discount"
                placeholder="25% off"
                value={formData.discount}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="terms">Terms</label>
              <input
                type="text"
                id="terms"
                name="terms"
                placeholder="Valid until 30/06/2023"
                value={formData.terms}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              "Create Offer"
            )}
          </button>
        </form>

        {message && (
          <div className="alert success">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="alert error">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateOfferForm;