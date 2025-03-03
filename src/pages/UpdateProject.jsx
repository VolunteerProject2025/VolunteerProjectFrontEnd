import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function UpdateProject ()  {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/projects/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data.data));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3000/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    alert(data.success ? "Project updated!" : data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      <textarea name="description" value={formData.description} onChange={handleChange} required />
      <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
      <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
      <input type="text" name="status" value={formData.status} onChange={handleChange} required />
      <button type="submit">Update Project</button>
    </form>
  );
};
