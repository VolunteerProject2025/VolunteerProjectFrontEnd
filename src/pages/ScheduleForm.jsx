import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export function CreateSchedule() {
    // const { projectId } = useParams(); // 🛑 Lấy ID dự án từ URL

    const navigate = useNavigate();

    // const [formData, setFormData] = useState({
    //     date: "",
    //     startTime: "",
    //     endTime: "",
    //     description: ""
    // });
    // console.log("📌 Dữ liệu gửi đi:", formData);

    const { projectId } = useParams(); // Lấy ID của project từ URL
    const [formData, setFormData] = useState({
        project: projectId,
        startTime: "",
        endTime: ""
    });
    const [project, setProject] = useState(null); // Lưu thông tin project để lấy startDate và endDate

    useEffect(() => {
        // Lấy thông tin project từ backend
        fetch(`http://localhost:3000/projects/${projectId}`)
            .then((res) => res.json())
            .then((data) => setProject({
                ...data,
                startDate: data.startDate.split("T")[0], // Chuyển về YYYY-MM-DD
                endDate: data.endDate.split("T")[0]     // Chuyển về YYYY-MM-DD
            })
        );
    }, [projectId]);


    // const handleChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setFormData((prev) => {
            if (name === "startTime") {
                return {
                    ...prev,
                    startTime: value,
                    endTime: prev.endTime && prev.endTime < value ? value : prev.endTime, // Cập nhật endTime nếu cần
                };
            } 
            
            if (name === "endTime" && value < prev.startTime) {
                alert("⏳ Thời gian kết thúc không thể nhỏ hơn thời gian bắt đầu!");
                return prev; // Không cập nhật state nếu không hợp lệ
            }
    
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post("http://localhost:3000/schedules/project/:projectId/schedules", {
                ...formData,
                project: projectId // 🛑 Gửi kèm projectId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Lịch trình được tạo thành công!");
            console.log(response.data);
            console.log(project.startDate);
            

            // 🚀 Chuyển hướng về trang chi tiết dự án
            navigate(`/projects/${projectId}`);
        } catch (error) {
            console.error("Lỗi khi tạo lịch trình", error);
            alert("Có lỗi xảy ra! Vui lòng thử lại.");
        }
    };

    return (
        <div className="form-container">
            <h2>Tạo Lịch Trình</h2>
            <form onSubmit={handleSubmit}>
                <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                min={project?.startDate} // Giới hạn ngày bắt đầu
                max={project?.endDate}
                 required />
                <input 
                type="time" 
                name="startTime" 
                value={formData.startTime} 
                onChange={handleChange}
                
                 required />
                <input type="time" name="endTime" value={formData.endTime}
                 onChange={handleChange} required />
                <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                
                placeholder="Mô tả" />

                <button type="submit">📅 Tạo Lịch Trình</button>
            </form>
        </div>
    );
}
