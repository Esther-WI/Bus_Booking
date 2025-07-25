import { useState, useEffect } from "react";

const BusForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    registration_number: initialData.registration_number || "",
    model: initialData.model || "",
    capacity: initialData.capacity || "",
    status: initialData.status || "Available",
    driver_id: initialData.driver_id || ""
  });

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/admin/users");
        setDrivers(response.data);
      } catch (err) {
        console.error("Failed to fetch drivers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

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
          pattern="[A-Za-z0-9]{6,10}"
          title="6-10 alphanumeric characters"
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
          min="1"
          max="100"
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
          required
        >
          <option value="Available">Available</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Unavailable">Unavailable</option>
        </select>
      </div>

      <div className="form-group">
        <label>Driver</label>
        <select
          name="driver_id"
          value={formData.driver_id}
          onChange={handleChange}
        >
          <option value="">Select Driver</option>
          {drivers.map(driver => (
            <option key={driver.id} value={driver.id}>
              {driver.username}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Save
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BusForm;