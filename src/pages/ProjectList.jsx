import { useState, useEffect } from "react";
import { fetchProjects, deleteProject } from "../hooks/api";
import { useNavigate } from "react-router-dom";
import '../assets/css/listProject.css';


export function ProjectList() {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    console.log("Full Project Data:", projects);


    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const projectsData = await fetchProjects();
            console.log("Fetched Projects:", projectsData);
            

            setProjects(projectsData.data || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

   
    const handleViewDetails = (id) => {
      navigate(`/projects/${id}`); // ✅ Điều hướng đến trang chi tiết
  };

    return (
        <div className="container">
            <h2>Project List</h2>
            <div className="row">
                {Array.isArray(projects) && projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project._id} className="col-md-6 col-lg-4" >
                            <div className="causes-item causes-item--primary">
                                <div className="causes-item__body">
                                    <div className="causes-item__top">
                                        <h6 className="causes-item__title">Dự án: {project.title}</h6>
                                        
                                    </div>
                                    <div className="causes-item__img">
                                        <div className="causes-item__badge" style={{ backgroundColor: "#49C2DF" }}>
                                            {project.categories || "No Category"}
                                        </div>
                                        <img style={{width: "100%"}} className="img--bg" src={`http://localhost:3000${project.image}`} alt="Project" />
                                    </div>

                                    <p className="causes-item__description">Mô tả dự án: {project.description}</p>
                                </div>
                                <button className="button causes-item__button button--primary" onClick={() => handleViewDetails(project._id)}>
                                Detail
                            </button>
                               
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No projects found.</p>
                )}
            </div>
        </div>
    );
}
