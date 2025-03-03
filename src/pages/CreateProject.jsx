import { useState } from "react";

export function CreateProject  ()  {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    organization: "",
    volunteers: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      
    });

    const data = await response.json();
    alert(data.success ? "Project created!" : data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input type="date" name="startDate" onChange={handleChange} required />
      <input type="date" name="endDate" onChange={handleChange} required />
      <input type="text" name="status" placeholder="Status" onChange={handleChange} required />
      <input type="text" name="organization" placeholder="Organization ID" onChange={handleChange} required />
      <button type="submit">Create Project</button>
    </form>
  );
};

