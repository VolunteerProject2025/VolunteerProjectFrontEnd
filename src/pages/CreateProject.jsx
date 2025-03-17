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
    const provinces = [
        "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "An Giang", "Bà Rịa - Vũng Tàu",
        "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương",
        "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên",
        "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương",
        "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
        "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình",
        "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh",
        "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa",
        "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc",
        "Yên Bái"
    ];

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
            console.log("Project ID:", projectId);

            // 🚀 Chuyển hướng đến trang tạo lịch trình (Schedule)
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
        
        {/* <input name="location" value={formData.location} onChange={handleChange} placeholder="Địa điểm" /> */}
        
       

        <select name="categories" value={formData.categories} onChange={handleChange} required>
    <option value="">-- Chọn danh mục --</option>
    <option value="environment">🌍 Môi trường & Sinh thái</option>
    <option value="healthcare">🏥 Y tế & Sức khỏe cộng đồng</option>
    <option value="education">📚 Giáo dục & Phát triển kỹ năng</option>
    <option value="community">🏠 Hỗ trợ cộng đồng & Xã hội</option>
    <option value="culture">🏛 Văn hóa & Nghệ thuật</option>
    <option value="technology">💻 Công nghệ & Kỹ thuật số</option>
    <option value="events">🏆 Sự kiện & Quản lý tình nguyện viên</option>
</select>

        

        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
         {/* Chọn địa điểm từ danh sách tỉnh/thành phố */}
         <select name="location" value={formData.location} onChange={handleChange} required>
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province, index) => (
                        <option key={index} value={province}>
                            {province}
                        </option>
                    ))}
                </select>
                {/* Input ảnh */}
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />
        

        <button type="submit">🚀 Tạo Dự Án</button>
    </form>
</div>


        
        
    );
    
}
