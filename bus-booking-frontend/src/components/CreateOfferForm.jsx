import { useState } from "react";
import api from "../utils/api"; // make sure this wraps axios with auth headers

const CreateOfferForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    terms: ""
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
    }
  };

  return (
    <div className="create-offer-form">
      <h2>Create Special Offer</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Offer Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Offer Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="discount"
          placeholder="Discount (e.g., 25% off)"
          value={formData.discount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="terms"
          placeholder="Terms and Conditions"
          value={formData.terms}
          onChange={handleChange}
        />
        <button type="submit">Create Offer</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreateOfferForm;
