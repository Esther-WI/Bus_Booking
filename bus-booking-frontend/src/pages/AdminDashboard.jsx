import { useState, useEffect } from "react";
import UserList from "../components/UserList";
import ScheduleList from "../components/ScheduleList";
import BusForm from "../components/BusForm";
import api from "../utils/api";
import "./AdminDashBoard.css"

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]); // Added missing routes state
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingBus, setEditingBus] = useState(null); // Added missing editingBus state
  const [userFormData, setUserFormData] = useState({ // Renamed from editedData for consistency
    username: "",
    email: "",
    role: "",
  });
  const [scheduleFormData, setScheduleFormData] = useState({ // Renamed from editedScheduleData
    route_id: "",
    bus_id: "",
    departure_time: "",
    arrival_time: "",
  });
  const [busFormData, setBusFormData] = useState({
    registration_number: "",
    model: "",
    capacity: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersResponse, schedulesResponse, busesResponse, routesResponse] =
          await Promise.all([
            api.get("http://127.0.0.1:5000/api/admin/users"),
            api.get("http://127.0.0.1:5000/api/schedules/"),
            api.get("http://127.0.0.1:5000/api/buses/"),
            api.get("http://127.0.0.1:5000/api/routes/"), // Added routes fetch
          ]);

        setUsers(usersResponse.data);
        setSchedules(schedulesResponse.data);
        setBuses(busesResponse.data);
        setRoutes(routesResponse.data);
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
      await api.delete(`http://127.0.0.1:5000/api/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleBusSubmit = async (busData) => {
  try {
    // Prepare the data for API
    const payload = {
      ...busData,
      driver_id: busData.driver_id || null  // Ensure null if empty
    };

    const response = busData.id
      ? await api.patch(`http://127.0.0.1:5000/api/buses/${busData.id}`, payload)
      : await api.post("http://127.0.0.1:5000/api/buses/", payload);

    setBuses(prev => 
      busData.id
        ? prev.map(b => b.id === busData.id ? response.data : b)
        : [...prev, response.data]
    );
    setEditingBus(null);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to save bus");
  }
};

  const handleUserUpdate = async () => {
    try {
      const response = await api.patch(
        `http://127.0.0.1:5000/api/admin/users/${editingUser.id}`,
        userFormData
      );

      setUsers(users.map((u) => (u.id === editingUser.id ? response.data : u)));
      setEditingUser(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user");
    }
  };

  const handleScheduleUpdate = async () => {
    try {
      const response = await api.patch(
        `http://127.0.0.1:5000/api/schedules/${editingSchedule.id}`,
        scheduleFormData
      );
  
      setSchedules(schedules.map(s => 
        s.id === editingSchedule.id ? response.data : s
      ));
      setEditingSchedule(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update schedule");
    }
  };

  const handleBusDelete = async (id) => {
    try {
      await api.delete(`http://127.0.0.1:5000/api/buses/${id}`);
      setBuses(buses.filter(b => b.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete bus");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Tabs Navigation */}
      <div className="admin-tabs">
        {["users", "schedules", "buses"].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* User Edit Form */}
      {editingUser && (
        <div className="edit-form">
          <h3>Edit User</h3>
          <input
            type="text"
            value={userFormData.username}
            onChange={(e) => setUserFormData({...userFormData, username: e.target.value})}
            placeholder="Username"
          />
          <input
            type="email"
            value={userFormData.email}
            onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
            placeholder="Email"
          />
          <select
            value={userFormData.role}
            onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
          >
            {["Customer", "Driver", "Admin"].map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <div className="form-actions">
            <button onClick={handleUserUpdate}>Save</button>
            <button onClick={() => setEditingUser(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Schedule Edit Form */}
      {editingSchedule && (
        <div className="edit-form">
          <h3>Edit Schedule</h3>
          <div className="form-group">
            <label>Route:</label>
            <select
              value={scheduleFormData.route_id}
              onChange={(e) => setScheduleFormData({
                ...scheduleFormData,
                route_id: e.target.value
              })}
            >
              <option value="">Select Route</option>
              {routes.map(route => (
                <option key={route.id} value={route.id}>
                  {route.origin} → {route.destination}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Bus:</label>
            <select
              value={scheduleFormData.bus_id}
              onChange={(e) => setScheduleFormData({
                ...scheduleFormData,
                bus_id: e.target.value
              })}
            >
              <option value="">Select Bus</option>
              {buses.map(bus => (
                <option key={bus.id} value={bus.id}>
                  {bus.registration_number} ({bus.model})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Departure:</label>
            <input
              type="datetime-local"
              value={scheduleFormData.departure_time}
              onChange={(e) => setScheduleFormData({
                ...scheduleFormData,
                departure_time: e.target.value
              })}
            />
          </div>

          <div className="form-group">
            <label>Arrival:</label>
            <input
              type="datetime-local"
              value={scheduleFormData.arrival_time}
              onChange={(e) => setScheduleFormData({
                ...scheduleFormData,
                arrival_time: e.target.value
              })}
            />
          </div>

          <div className="form-actions">
            <button onClick={handleScheduleUpdate}>Save</button>
            <button onClick={() => setEditingSchedule(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Bus Edit Form */}
      {editingBus && (
        <div className="edit-form">
          <h3>{editingBus.id ? "Edit Bus" : "Add New Bus"}</h3>
          <BusForm 
            busData={editingBus}
            onSubmit={handleBusSubmit}
            onCancel={() => setEditingBus(null)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="admin-content">
        {activeTab === "users" && !editingUser && (
          <UserList
            users={users}
            onDelete={handleUserDelete}
            onEdit={(user) => {
              setEditingUser(user);
              setUserFormData({
                username: user.username,
                email: user.email,
                role: user.role,
              });
            }}
          />
        )}

        {activeTab === "schedules" && !editingSchedule && (
          <ScheduleList
            schedules={schedules}
            onEdit={(schedule) => {
              setEditingSchedule(schedule);
              setScheduleFormData({
                route_id: schedule.route_id,
                bus_id: schedule.bus_id,
                departure_time: schedule.departure_time,
                arrival_time: schedule.arrival_time,
              });
            }}
            userRole="Admin"
          />
        )}

        {activeTab === "buses" && !editingBus && (
          <div className="buses-section">
            <button 
              className="add-new-btn"
              onClick={() => setEditingBus({
                registration_number: "",
                model: "",
                capacity: ""
              })}
            >
              + Add New Bus
            </button>

            <div className="buses-list">
              {buses.map(bus => (
                <div key={bus.id} className="bus-item">
                  <div className="bus-info">
                    <strong>{bus.registration_number}</strong>
                    <span>{bus.model} ({bus.capacity} seats)</span>
                  </div>
                  <div className="bus-actions">
                    <button onClick={() => setEditingBus(bus)}>
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleBusDelete(bus.id)}
                    >
                      Delete
                    </button>
                  </div>
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