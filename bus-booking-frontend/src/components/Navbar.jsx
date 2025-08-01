import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./NavBar.css"; // Assuming you have a CSS file for styling

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">BusBooking</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/popular-routes">Popular Routes</Link>
        <Link to="/about">About</Link>

        {isAuthenticated ? (
          <>
            {user?.role === "Admin" && (
              <Link to="/admin/dashboard-data">Admin Dashboard</Link>
            )}
            {user?.role === "Driver" && (
              <>
                <Link to="/driver-dashboard">Driver Dashboard</Link>
                <Link to="/buses">My buses</Link>
              </>

              
            )}
            {user?.role === "Customer" && (
                <Link to={"/buses"}>Feedback</Link>
            )}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
