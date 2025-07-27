import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Register.css"; // Assuming you have a CSS file for styling

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone_number: "",
    password: "",
    Role: "customer"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    {/*if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }*/}


    if (!acceptedTerms) {
      setError("You must accept the terms and conditions");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone_number)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }
  
    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await api.post("http://127.0.0.1:5000/api/auth/signup", {
        username: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        Role: formData.Role.charAt(0).toUpperCase() + formData.Role.slice(1)
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  /*const toggleRole = (selectedRole) => {
    setFormData((prev) => {
      const roles = prev.role.includes(selectedRole)
        ? prev.role.filter((r) => r !== selectedRole)
        : [...prev.role, selectedRole];
      return { ...prev, roles };
    });
  };*/
  

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <h1>Join BusBooker</h1>
          <p>Create your account and start your journey</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            {success && (
              <div className="success-message">
                Registration successful! Redirecting to login...
              </div>
            )}

            <div className="role-selection">
              <button
                type="button"
                className={`role-button ${
                  formData.Role === "customer" ? "active" : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, Role: "customer" }))
                }
              >
                Customer
              </button>
              <button
                type="button"
                className={`role-button ${
                  formData.Role === "driver" ? "active" : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, Role: "driver" }))
                }
              >
                Driver
              </button>
            </div>

            <div className="name-fields">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                placeholder="+1 (123) 456-7890"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/*<div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>*/}

            <div className="terms-agreement">
              <label>
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={() => setAcceptedTerms(!acceptedTerms)}
                />
                I agree to the <a href="/terms">Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="auth-button">
              Create {formData.Role === "driver" ? "Driver" : "Customer"}{" "}
              Account
            </button>
          </form>

          <div className="auth-switch">
            <p>Already have an account?</p>
            <a href="/login" className="switch-link">
              Sign in Instead
            </a>
          </div>
        </div>

        <div className="auth-right">
          <h2>Travel with Confidence</h2>
          <p>
            Join thousands of satisfied travelers who choose BusBooker for their
            journeys
          </p>

          <ul className="benefits-list">
            <li>Book bus tickets instantly</li>
            <li>Track your bookings</li>
            <li>Get email confirmations</li>
            <li>Save favorite routes</li>
            <li>24/7 customer support</li>
          </ul>

          <div className="special-offer">
            <h3>Special Offer!</h3>
            <p>Get 20% off your first booking when you sign up today</p>
            <p className="trust-badge">Secure & trusted by 1M+ users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
