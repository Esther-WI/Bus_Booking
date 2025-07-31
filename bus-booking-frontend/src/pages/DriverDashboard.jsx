import { useState, useEffect, useContext } from "react";
import BusForm from "../components/BusForm";
import ScheduleList from "../components/ScheduleList";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const DriverDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bus, setBus] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const [busResponse, schedulesResponse] = await Promise.all([
          api.get(`http://127.0.0.1:5000/api/buses/my`),
          api.get(`http://127.0.0.1:5000/api/schedules/driver/my`),
        ]);
  
        // Check if bus exists (response might be array or object)
        const busData = busResponse.data;
        const bus = Array.isArray(busData) ? 
          (busData.length > 0 ? busData[0] : null) : 
          busData;
  
        setBus(bus);
        setSchedules(Array.isArray(schedulesResponse.data) ? schedulesResponse.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch driver data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchDriverData();
  }, [user]);

  const handleBusSubmit = async (busData) => {
    try {
      if (!bus || !bus.id) {
        setError("No bus assigned or bus ID missing");
        return;
      }
      const response = await api.patch(`http://127.0.0.1:5000/api/buses/${bus.id}`, busData);
      setBus(response.data[0] || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update bus");
    }
  };

  const handleDelete = async (id) => {
    if (user?.Role !== "Admin") {
      setError("Only admins can delete schedules.");
      return;
    }

    try {
      await api.delete(`http://127.0.0.1:5000/api/admin/schedules/${id}`);
      setSchedules(schedules.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete schedule");
    }
  };

  return (
    <div className="driver-dashboard">
      <h2>Driver Dashboard</h2>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="driver-section">
        <h3>Your Bus Information</h3>
        {bus ? (
          <BusForm onSubmit={handleBusSubmit} initialData={bus} isUpdate={!!bus}/>
        ) : (
          <div className="no-bus">No bus assigned to you</div>
        )}
      </div>

      <div className="driver-section">
        <h3>Your Schedules</h3>
        {schedules.length > 0 ? (
          <ScheduleList
            schedules={schedules}
            onDelete={handleDelete}
            onEdit={(schedule) => {
              console.log("Edit schedule", schedule);
            }}
            userRole={user?.Role}
          />
        ) : (
          <div className="no-schedules">No schedules assigned to you</div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
