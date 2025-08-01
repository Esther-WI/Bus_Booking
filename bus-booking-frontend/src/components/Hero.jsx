import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          Travel Smarter <span className="highlight">with BusBooker</span>
        </h1>
        <p className="hero-subtitle">
          Book comfortable, affordable bus tickets to destinations nationwide.
          Safe travels, great prices, guaranteed.
        </p>
        <div className="hero-actions">
          <Link to="/search" className="hero-button primary">
            Book Now
          </Link>
          <Link to="/popular-routes" className="hero-button secondary">
            Popular Routes
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;