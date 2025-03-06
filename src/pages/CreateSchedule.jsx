import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export function CreateSchedule() {
  const { id } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("Input changed:", e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:3000/schedules", {
        ...formData,
        project: id, // Ensure project ID is sent
      });
  
      alert("Schedule created!");
      navigate(`/projects/${id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create schedule");
    }
  };

  return (
    <div>
      <h2>Create Schedule</h2>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <button type="submit">Create Schedule</button>
      </form>
      <button onClick={() => navigate(`/projects/${id}`)}>Cancel</button>
    </div>
  );
}
