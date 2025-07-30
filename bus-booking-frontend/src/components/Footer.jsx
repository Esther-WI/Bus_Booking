import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>BusBooker</h2>
          <p>
            Your trusted partner for comfortable and affordable bus travel
            across the nation.
          </p>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div className="links-column">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/search">Search Buses</a>
              </li>
              <li>
                <a href="/popular-routes">Popular Routes</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="links-column">
            <h3>Support</h3>
            <ul>
              <li>
                <a href="/help">Help Center</a>
              </li>
              <li>
                <a href="/terms">Terms of Service</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/refund">Refund Policy</a>
              </li>
            </ul>
          </div>

          <div className="links-column">
            <h3>Contact Us</h3>
            <ul className="contact-icons">
              <li>
                <FaPhoneAlt /> <span>+254 78947583</span>
              </li>
              <li>
                <FaEnvelope /> <span>support@busbooker.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BusBooker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;