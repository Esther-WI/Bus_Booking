import { useState } from "react";

const BusForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    busNumber: initialData.busNumber || "",
    capacity: initialData.capacity || "",
    model: initialData.model || "",
    licensePlate: initialData.licensePlate || "",
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
          name="busNumber"
          value={formData.busNumber}
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
        <label>License Plate</label>
        <input
          type="text"
          name="licensePlate"
          value={formData.licensePlate}
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
