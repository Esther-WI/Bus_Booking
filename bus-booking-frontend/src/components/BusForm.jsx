import { useState } from "react";

const BusForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
      registration_number: initialData.registration_number || "",
      capacity: initialData.capacity || "", // this isn't used in backend, you might remove it
      model: initialData.model || "",
      status: initialData.status || "Available", // optional field
      driver_id: initialData.driver_id || "", // required by backend
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bus-form">
      <div className="form-group">
        <label>Bus Number</label>
        <input
          type="text"
          name="redistration_number"
          value={formData.registration_number}
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
        <label>Driver ID</label>
        <input
          type="text"
          name="licensePlate"
          value={formData.driver_id}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="submit-button">
        Save Bus
      </button>
    </form>
  );
};

export default BusForm;
