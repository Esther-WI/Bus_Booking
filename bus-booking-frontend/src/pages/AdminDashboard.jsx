import { useState, useEffect } from "react";
import { FiUsers, FiCalendar, FiTruck, FiPlus, FiEdit2, FiTrash2, FiActivity } from "react-icons/fi";
import api from "../utils/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuses: 0,
    activeBuses: 0,
    scheduledTrips: 0
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersResponse, schedulesResponse, busesResponse] = await Promise.all([
          api.get("http://127.0.0.1:5000/api/admin/users"),
          api.get("http://127.0.0.1:5000/api/schedules/"),
          api.get("http://127.0.0.1:5000/api/buses/")
        ]);

        setUsers(usersResponse.data);
        setSchedules(schedulesResponse.data);
        setBuses(busesResponse.data);
        
        // Calculate stats from the responses
        setStats({
          totalUsers: usersResponse.data.length,
          totalBuses: busesResponse.data.length,
          activeBuses: busesResponse.data.filter(b => b.status === 'active').length,
          scheduledTrips: schedulesResponse.data.length
        });
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
      setUsers(users.filter(u => u.id !== id));
      setStats(prev => ({...prev, totalUsers: prev.totalUsers - 1}));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleScheduleDelete = async (id) => {
    try {
      await api.delete(`http://127.0.0.1:5000/api/admin/schedules/${id}`);
      setSchedules(schedules.filter(s => s.id !== id));
      setStats(prev => ({...prev, scheduledTrips: prev.scheduledTrips - 1}));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete schedule");
    }
  };

  const handleBusSubmit = async (busData) => {
    try {
      const response = busData.id
        ? await api.patch(`http://127.0.0.1:5000/api/buses/${busData.id}`, busData)
        : await api.post("http://127.0.0.1:5000/api/buses/", busData);

      setBuses(
        busData.id
          ? buses.map(b => b.id === busData.id ? response.data : b)
          : [...buses, response.data]
      );
      
      // Update stats if adding new bus
      if (!busData.id) {
        setStats(prev => ({
          ...prev,
          totalBuses: prev.totalBuses + 1,
          activeBuses: response.data.status === 'active' ? prev.activeBuses + 1 : prev.activeBuses
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save bus");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <StatCard 
                icon={<FiUsers />}
                title="Total Users"
                value={stats.totalUsers}
              />
              <StatCard 
                icon={<FiTruck />}
                title="Total Buses"
                value={stats.totalBuses}
              />
              <StatCard 
                icon={<FiActivity />}
                title="Active Buses"
                value={stats.activeBuses}
              />
              <StatCard 
                icon={<FiCalendar />}
                title="Scheduled Trips"
                value={stats.scheduledTrips}
              />
            </div>
          </div>
        );
      case "users":
        return (
          <div className="users-section">
            <div className="section-header">
              <h2><FiUsers /> User Management</h2>
              <button className="btn-primary">
                <FiPlus /> Add User
              </button>
            </div>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                          {user.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="btn-icon">
                          <FiEdit2 />
                        </button>
                        <button 
                          className="btn-icon danger"
                          onClick={() => handleUserDelete(user.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "schedules":
        return (
          <div className="schedules-section">
            <div className="section-header">
              <h2><FiCalendar /> Schedule Management</h2>
              <button className="btn-primary">
                <FiPlus /> Add Schedule
              </button>
            </div>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Frequency</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(schedule => (
                    <tr key={schedule.id}>
                      <td>{schedule.route_id}</td>
                      <td>{new Date(schedule.departure_time).toLocaleString()}</td>
                      <td>{new Date(schedule.arrival_time).toLocaleString()}</td>
                      <td>{schedule.frequency}</td>
                      <td>
                        <span className={`status-badge ${schedule.active ? 'active' : 'inactive'}`}>
                          {schedule.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="btn-icon">
                          <FiEdit2 />
                        </button>
                        <button 
                          className="btn-icon danger"
                          onClick={() => handleScheduleDelete(schedule.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "buses":
        return (
          <div className="buses-section">
            <div className="section-header">
              <h2><FiTruck /> Bus Fleet Management</h2>
              <button className="btn-primary">
                <FiPlus /> Add Bus
              </button>
            </div>
            
            <div className="bus-form-container">
              <h3>Add/Edit Bus</h3>
              <BusForm onSubmit={handleBusSubmit} />
            </div>
            
            <div className="buses-grid">
              {buses.map(bus => (
                <div key={bus.id} className="bus-card">
                  <div className="bus-header">
                    <FiTruck className="bus-icon" />
                    <span className="bus-reg">{bus.registration_number}</span>
                  </div>
                  <div className="bus-details">
                    <p><strong>Model:</strong> {bus.model}</p>
                    <p><strong>Capacity:</strong> {bus.capacity} seats</p>
                    <p><strong>Status:</strong> 
                      <span className={`status-badge ${bus.status}`}>
                        {bus.status}
                      </span>
                    </p>
                  </div>
                  <div className="bus-actions">
                    <button 
                      className="btn-icon"
                      onClick={() => {
                        // Implement edit functionality
                        console.log("Edit bus", bus);
                      }}
                    >
                      <FiEdit2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>
      
      <div className="admin-tabs">
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          <FiActivity /> Dashboard
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          <FiUsers /> Users
        </button>
        <button
          className={activeTab === "schedules" ? "active" : ""}
          onClick={() => setActiveTab("schedules")}
        >
          <FiCalendar /> Schedules
        </button>
        <button
          className={activeTab === "buses" ? "active" : ""}
          onClick={() => setActiveTab("buses")}
        >
          <FiTruck /> Buses
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="error-alert">
            <FiAlertCircle />
            <p>{error}</p>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

// Helper component for dashboard stats
const StatCard = ({ icon, title, value }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h4>{title}</h4>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
};

// BusForm component (should be in your components folder)
const BusForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    registration_number: "",
    model: "",
    capacity: "",
    status: "active"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bus-form">
      <div className="form-group">
        <label>Registration Number</label>
        <input
          type="text"
          name="registration_number"
          value={formData.registration_number}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Model</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Capacity</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button type="submit" className="btn-primary">
        {initialData ? "Update Bus" : "Add Bus"}
      </button>
    </form>
  );
};

export default AdminDashboard;