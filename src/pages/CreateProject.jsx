import { useState, useEffect } from "react";
import { useAuth } from "../hooks/authHook";
import { organizationProfile } from "../hooks/profileHook";
import { useNavigate } from "react-router-dom"; 

export function CreateProject() {
  const { user } = useAuth();
  const { organization } = organizationProfile();
  const navigate = useNavigate();
  

  console.log("organizationProfile result:", organization); // Debugging

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    organization: null, 
    volunteers: [],
  });

  useEffect(() => {
    console.log("Effect triggered - organization:", organization);
  
    if (organization?.organization?._id) {
      setFormData((prev) => ({
        ...prev,
        organization: organization.organization._id,
      }));
      console.log("Updated organization ID in formData:", organization.organization._id);
    }
  }, [organization]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Sending data:", formData);

    const response = await fetch("http://localhost:3000/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    alert(data.success ? "Project created!" : data.message);
    navigate("/project");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "200px" }}>
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input type="date" name="startDate" onChange={handleChange} required />
      <input type="date" name="endDate" onChange={handleChange} required />
      <input type="hidden" name="organization" value={formData.organization || ""} readOnly required />
      <button type="submit">Create Project</button>
    </form>
  );
}
