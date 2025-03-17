import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectsByOrgId } from "../hooks/api";

export function OrgProject() {
    const { organizationId } = useParams();
    console.log("Organization ID from URL:", organizationId);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await getProjectsByOrgId(organizationId);
            console.log("API Response:", response.data); // 🛠 Debug API response
            if (response && response.data) {
                setProjects(Array.isArray(response.data) ? response.data : []);
            } else {
                setProjects([]); // 🔥 Nếu API không trả về mảng, gán mảng rỗng
            }
        } catch (err) {
            setError("Failed to fetch projects");
            setProjects([]); // 🔥 Fix: Gán mảng rỗng khi lỗi
            setLoading(false);
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/projects/${id}`);
    };
    const handleCreateProject = () => {
        navigate("/create"); // Điều hướng đến trang tạo dự án
    };

    return (
        <div className="container">
            <h2 className="text-center mt-4">Projects for Organization</h2>

            
            {/* 🔹 Nút "Create Project" */}
            <div className="text-end">
                <button className="btn btn-success mb-3" onClick={handleCreateProject}>
                    ➕ Create Project
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}

            {projects.length > 0 ? (
                <ul className="list-group mt-3">
                    {projects.map((project) => (
                        <li key={project._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="mb-1">{project.title}</h6>
                                <p className="mb-1">{project.description}</p>
                                <small className="text-muted">Category: {project.categories || "No Category"}</small>
                            </div>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleViewDetails(project._id)}
                            >
                                View Details
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No projects found for this organization.</p>
            )}
        </div>
    );
}
