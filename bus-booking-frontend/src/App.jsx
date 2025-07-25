import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Booking from "./pages/Booking";
import PopularRoutes from "./pages/PopularRoutes";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import "./index.css";
import BookingsList from "./pages/BookingsList";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <Search />
                  </>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/popular-routes" element={<PopularRoutes />} />
              <Route path="/driver-dashboard" element={<DriverDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/bookings" element={<BookingsList />}/>
              <Route path="/feedback" element={<Feedback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
