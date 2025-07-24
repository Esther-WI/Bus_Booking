import { useState, useEffect } from "react";
import UserList from "../components/UserList";
import ScheduleList from "../components/ScheduleList";
import BusForm from "../components/BusForm";
import api from "../utils/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersResponse, schedulesResponse, busesResponse] =
          await Promise.all([
            api.get("/users"),
            api.get("/schedules"),
            api.get("/buses"),
          ]);

        setUsers(usersResponse.data);
        setSchedules(schedulesResponse.data);
        setBuses(busesResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleUserDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleScheduleDelete = async (id) => {
    try {
      await api.delete(`/schedules/${id}`);
      setSchedules(schedules.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete schedule");
    }
  };

  const handleBusSubmit = async (busData) => {
    try {
      const response = busData.id
        ? await api.put(`/buses/${busData.id}`, busData)
        : await api.post("/buses", busData);

      setBuses(
        busData.id
          ? buses.map((b) => (b.id === busData.id ? response.data : b))
          : [...buses, response.data]
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save bus");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="admin-tabs">
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={activeTab === "schedules" ? "active" : ""}
          onClick={() => setActiveTab("schedules")}
        >
          Schedules
        </button>
        <button
          className={activeTab === "buses" ? "active" : ""}
          onClick={() => setActiveTab("buses")}
        >
          Buses
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "users" && (
          <UserList
            users={users}
            onDelete={handleUserDelete}
            onEdit={(user) => {
              // Implement edit functionality
              console.log("Edit user", user);
            }}
          />
        )}

        {activeTab === "schedules" && (
          <ScheduleList
            schedules={schedules}
            onDelete={handleScheduleDelete}
            onEdit={(schedule) => {
              // Implement edit functionality
              console.log("Edit schedule", schedule);
            }}
          />
        )}

        {activeTab === "buses" && (
          <div className="buses-section">
            <h3>Add New Bus</h3>
            <BusForm onSubmit={handleBusSubmit} />

            <h3>Existing Buses</h3>
            <div className="buses-list">
              {buses.map((bus) => (
                <div key={bus.id} className="bus-item">
                  <p>
                    Bus #{bus.busNumber} - {bus.model} (Capacity: {bus.capacity}
                    )
                  </p>
                  <button
                    onClick={() => {
                      // Implement edit functionality
                      console.log("Edit bus", bus);
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
