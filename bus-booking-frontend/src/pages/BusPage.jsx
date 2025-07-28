import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import BusForm from "../components/BusForm";

const BusesPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check user role
        const roleResponse = await api.get("http://127.0.0.1:5000/api/auth/role");
        setUserRole(roleResponse.data.role);
        
        // Fetch buses based on role
        const endpoint = roleResponse.data.role === "Admin" 
          ? "http://127.0.0.1:5000/api/buses" 
          : "http://127.0.0.1:5000/api/buses/my";
        const busesResponse = await api.get(endpoint);
        setBuses(busesResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load buses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateBus = async (busData) => {
    try {
      const response = await api.post("http://127.0.0.1:5000/api/buses", busData);
      setBuses([...buses, response.data]);
      setShowForm(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create bus");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="buses-page">
      <h2>{userRole === "Admin" ? "All Buses" : "My Assigned Buses"}</h2>
      
      {userRole === "Admin" && (
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Bus"}
        </button>
      )}

      {showForm && (
        <BusForm 
          onSubmit={handleCreateBus} 
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="buses-list">
        {buses.length > 0 ? (
          buses.map(bus => (
            <div key={bus.id} className="bus-card">
              <h3>{bus.model} ({bus.registration_number})</h3>
              <p>Capacity: {bus.capacity}</p>
              <p>Status: {bus.status}</p>
              
              {userRole === "Admin" && (
                <div className="bus-actions">
                  <button onClick={() => navigate(`http://127.0.0.1:5000/api/buses/${bus.id}`)}>
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No buses found</p>
        )}
      </div>
    </div>
  );
};

export default BusesPage;