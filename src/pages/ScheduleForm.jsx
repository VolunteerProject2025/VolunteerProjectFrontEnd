import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export function CreateSchedule() {
    const { id } = useParams(); // Get project ID from URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        project: id,
        date: "",
        startTime: "",
        endTime: "",
        description: ""
    });
    const [project, setProject] = useState(null);

    useEffect(() => {
        // Fetch project details from backend
        axios.get(`http://localhost:3000/projects/${id}`)
            .then((response) => {
                const projectData = response.data.data; // Access the 'data' field

                setProject({
                    ...projectData,
                    startDate: projectData.startDate.split("T")[0], // Convert to YYYY-MM-DD
                    endDate: projectData.endDate.split("T")[0]     // Convert to YYYY-MM-DD
                });
            })
            .catch((error) => console.error("Error fetching project:", error)); 
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            if (name === "startTime") {
                return {
                    ...prev,
                    startTime: value,
                    endTime: prev.endTime && prev.endTime < value ? value : prev.endTime, // Update endTime if necessary
                };
            }

            if (name === "endTime" && value < prev.startTime) {
                alert("⏳ Thời gian kết thúc không thể nhỏ hơn thời gian bắt đầu!");
                return prev; // Do not update state if invalid
            }

            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `http://localhost:3000/schedules/project/${id}/schedules`, 
                formData, 
                { withCredentials: true }
            );

            alert("Lịch trình được tạo thành công!");
            console.log(response.data);
            console.log("Project Start Date:", project?.startDate);

            // Redirect to project details page
            navigate(`/projects/${id}`);
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
