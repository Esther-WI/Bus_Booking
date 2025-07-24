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
          api.get(`/drivers/${user.id}/bus`),
          api.get(`/drivers/${user.id}/schedules`),
        ]);

        setBus(busResponse.data);
        setSchedules(schedulesResponse.data);
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
      const response = await api.put(`/buses/${bus.id}`, busData);
      setBus(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update bus");
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
          <BusForm onSubmit={handleBusSubmit} initialData={bus} />
        ) : (
          <div className="no-bus">No bus assigned to you</div>
        )}
      </div>

      <div className="driver-section">
        <h3>Your Schedules</h3>
        {schedules.length > 0 ? (
          <ScheduleList
            schedules={schedules}
            onDelete={async (id) => {
              try {
                await api.delete(`/schedules/${id}`);
                setSchedules(schedules.filter((s) => s.id !== id));
              } catch (err) {
                setError(
                  err.response?.data?.message || "Failed to delete schedule"
                );
              }
            }}
            onEdit={(schedule) => {
              // Implement edit functionality
              console.log("Edit schedule", schedule);
            }}
          />
        ) : (
          <div className="no-schedules">No schedules assigned to you</div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
