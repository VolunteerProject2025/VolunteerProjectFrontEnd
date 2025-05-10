import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function UpdateProject ()  {
  const { id } = useParams();
 
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    categories: "",
    startDate: "",
    endDate: "",
    
  });
  const [image, setImage] = useState(null); 

  useEffect(() => {
    fetch(`http://localhost:3000/projects/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data.data));
  }, [id]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const { status, ...updatedFormData } = formData;

    console.log("Submitting form data (without status):", updatedFormData);
    const response = await fetch(`http://localhost:3000/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFormData),
    });
     console.log(response);
    //  console.log(formData);
     
     
    const data = await response.json();
    console.log(data);
    
    alert(data.success ? "Project updated!" : data.message);
    navigate(`/projects/${id}`);
  };

  return (
    <div className="form-container">
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Tên dự án</label>
       <input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Tên dự án" required />
        <label htmlFor="description">Mô tả dự án</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Mô tả" />
        <label htmlFor="location">Địa điểm</label>
        <input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Địa điểm" />
        <label htmlFor="categories">Danh mục</label>
        <input id="categories" name="categories" value={formData.categories} onChange={handleChange} placeholder="Danh mục" />
        <label htmlFor="startDate">Ngày bắt đầu</label>
        <input id="startDate" type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        <label htmlFor="endDate">Ngày kết thúc</label>
        <input id="endDate" type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        {/* Input ảnh */}
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />

        
      <button type="submit">Update Project</button>
    </form>
    </div>
  );
};