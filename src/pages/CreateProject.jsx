import { useState, useContext, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { organizationProfile } from "../hooks/profileHook";
import "../assets/css/createProject.css";

export function CreateProject() {
    const {organization} = organizationProfile();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        categories: "",
        startDate: "",
        endDate: "",
        volunteerNumber: 0,
        organization: "" // Added organization field
    });

    const [image, setImage] = useState(null);
    const { user } = useContext(AuthContext);

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

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!user || !user._id) {
                alert("Bạn cần đăng nhập để tạo dự án!");
                return;
            }

            const token = localStorage.getItem("token");

            // 🔹 Tạo FormData để gửi file
            const formDataToSend = new FormData();
            for (let key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            if (image) {
                formDataToSend.append("image", image);
            }
            


            // 🔹 Gửi request tạo dự án
            const response = await axios.post("http://localhost:3000/projects", formDataToSend, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });

            alert("Dự án được tạo thành công!");
            const projectId = response.data.projectId;  

            //  Chuyển hướng đến trang tạo lịch trình (Schedule)
            navigate(`/${projectId}`);

            // 🔹 Reset form
            setFormData({
                title: "",
                description: "",
                location: "",
                categories: "",
                startDate: "",
                endDate: "",
                volunteerNumber: 0,
                organization: ""
            });
            setImage(null);
} catch (error) {
            console.error("Lỗi khi tạo dự án", error);
            alert("Có lỗi xảy ra! Vui lòng thử lại.");
        }
    };

    return (
        <div className="form-container">
    <h2>Tạo Dự Án Mới</h2>
    <form onSubmit={handleSubmit} encType="multipart/form-data">
        
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Tên dự án" required />
        
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Mô tả" />
        
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Địa điểm" />
        
        <input name="categories" value={formData.categories} onChange={handleChange} placeholder="Danh mục" />

        {/* Input ảnh */}
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />

        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        

        <button type="submit"> Tạo Dự Án</button>
    </form>
</div>


        
        
    );
    
}