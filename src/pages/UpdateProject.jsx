import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function UpdateProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    categories: "",
    startDate: "",
    endDate: "",
    // Don't include volunteer or organization in the initial state
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Remove volunteer array and extract organization ID as string
        const { volunteer, organization, ...rest } = data.data;
        const organizationId = organization?._id || organization;
        
        setFormData({
          ...rest,
          // Include organization only if it's a string ID
          ...(typeof organizationId === 'string' ? { organization: organizationId } : {})
          // Exclude volunteer array completely from the form data
        });
        setCurrentImage(data.data.image);
      });
  }, [id]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle the file upload
    const formDataToSend = new FormData();
    
    // Remove problematic fields from formData
    const { status, volunteer, ...dataToUpdate } = formData;
    
    // Add all form fields to FormData, ensuring they're all strings
    Object.keys(dataToUpdate).forEach(key => {
      const value = dataToUpdate[key];
      // Skip null/undefined values
      if (value === null || value === undefined) return;
      
      // Convert objects to their string ID if they have one
      if (typeof value === 'object' && !Array.isArray(value) && value._id) {
        formDataToSend.append(key, value._id);
      } 
      // Skip arrays to avoid sending empty arrays or arrays with empty strings
      else if (!Array.isArray(value)) {
        formDataToSend.append(key, value);
      }
    });
    
    // Only append the image if a new one is selected
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      const response = await fetch(`http://localhost:3000/projects/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert("Project updated successfully!");
        navigate(`/projects/${id}`);
      } else {
        alert(data.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("An error occurred while updating the project");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Tên dự án</label>
        <input id="title" name="title" value={formData.title || ""} onChange={handleChange} placeholder="Tên dự án" required />
        
        <label htmlFor="description">Mô tả dự án</label>
        <textarea id="description" name="description" value={formData.description || ""} onChange={handleChange} placeholder="Mô tả" />
        
        <label htmlFor="location">Địa điểm</label>
        <input id="location" name="location" value={formData.location || ""} onChange={handleChange} placeholder="Địa điểm" />
        
        <label htmlFor="categories">Danh mục</label>
        <input id="categories" name="categories" value={formData.categories || ""} onChange={handleChange} placeholder="Danh mục" />
        
        <label htmlFor="startDate">Ngày bắt đầu</label>
        <input id="startDate" type="date" name="startDate" value={formData.startDate || ""} onChange={handleChange} required />
        
        <label htmlFor="endDate">Ngày kết thúc</label>
        <input id="endDate" type="date" name="endDate" value={formData.endDate || ""} onChange={handleChange} required />
        
        {/* Current image display */}
        {currentImage && (
          <div className="current-image">
            <p>Current image:</p>
            <img src={currentImage} alt="Current project" style={{ maxWidth: "200px" }} />
          </div>
        )}
        
        {/* Image upload - make it not required since we might be keeping the existing image */}
        <label htmlFor="image">Ảnh dự án</label>
        <input 
          id="image" 
          type="file" 
          name="image" 
          accept="image/*" 
          onChange={handleImageChange} 
        />
        <p className="image-hint">Chỉ tải lên ảnh nếu bạn muốn thay đổi ảnh hiện tại</p>
        
        <button type="submit">Update Project</button>
      </form>
    </div>
  );
}