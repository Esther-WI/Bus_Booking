import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import "./Login.css"; 

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("http://127.0.0.1:5000/api/auth/login", {...formData,rememberMe});
      login(response.data.user, response.data.access_token, rememberMe);
      // Redirect based on role
      if (response.data.user.role === "admin") {
        navigate("/api/admin/dashboard-data");
      } else if (response.data.user.role === "driver") {
        navigate("/api/buses/my");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <h1>Welcome back</h1>
          <p>Sign in to your BusBooker account</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="auth-button">
              Sign In
            </button>
          </form>

          <div className="auth-switch">
            <p>Don't have an account?</p>
            <a href="/register" className="switch-link">
              Create New Account
            </a>
          </div>

          <div className="driver-option">
            <p>Are you a bus operator?</p>
            <a href="/register-driver" className="driver-link">
              Register as a Driver
            </a>
          </div>
        </div>

        <div className="auth-right">
          <h2>Why Choose BusBooker?</h2>
          <p>
            Join thousands of satisfied travelers who trust us for their journey
          </p>

          <div className="benefits">
            <div className="benefit-item">
              <div className="benefit-icon">🔒</div>
              <h3>Secure Login</h3>
              <p>Your data is protected with enterprise-grade security</p>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">⚡</div>
              <h3>Quick Access</h3>
              <p>Access your bookings and preferences instantly</p>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">✔️</div>
              <h3>Verified Account</h3>
              <p>Join thousands of verified travelers</p>
            </div>
          </div>

          <div className="cta-section">
            <h3>Ready to get started?</h3>
            <p>Book your first trip and experience the difference</p>
            <p className="happy-customers">Over 1M+ happy customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
