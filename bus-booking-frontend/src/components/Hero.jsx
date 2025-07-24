import { Link } from "react-router-dom";
import "./Hero.css"; // Assuming you have a CSS file for styling
import heroBus from "../assets/bus1.jpeg";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Travel Smarter with BusBooker</h1>
        <p className="hero-subtitle">
          Book comfortable, affordable bus tickets to destinations nationwide.
          <br />
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
      <div className="hero-image">
        <img src={heroBus} alt="Comfortable bus interior" />
      </div>
    </section>
  );
};

export default Hero;
