import { useState, useEffect } from "react";
import axios from "axios"; // ✅ Import axios
import { Link } from "react-router-dom";

export function ProjectList() {
  const [projects, setProjects] = useState([]); // ✅ Ensure projects is always an array
  const [loading, setLoading] = useState(true); // ✅ Track loading state
  const [error, setError] = useState(null); // ✅ Handle error state

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("🔄 Fetching projects...");
        const response = await axios.get("http://localhost:3000/projects");

        console.log("✅ Full API Response:", response);
        console.log("📂 Data:", response.data);

        // Sửa lại để lấy đúng dữ liệu
        setProjects(response.data.data || []);

      } catch (error) {
        console.error("❌ Error fetching projects:", error);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };


    fetchProjects();
  }, []);

  if (loading) return <p>Loading projects...</p>; // ✅ Show a loading message
  if (error) return <p>{error}</p>; // ✅ Show error message
  if (!projects.length) return <p>No projects found.</p>; // ✅ Handle empty case

  return (
    <div className="col-xl-10 offset-xl-1">
      <h2>Project List</h2>
      {projects.map((project) => {
        // ✅ Chuyển đổi ngày về dạng hiển thị
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);

        const formatDate = (date) =>
          date.toLocaleString("en-US", { day: "2-digit", month: "short", year: "2-digit" });
        
        return (
          <div className="upcoming-item" key={project._id}>
            
            <div className="upcoming-item__body">
              <div className="row align-items-center">
                <div className="col-lg-5 col-xl-4">
                  <div className="upcoming-item__img">
                    <img className="img--bg" src="img/event_7.jpg" alt="img" />
                  </div>
                </div>
                <div className="col-lg-7 col-xl-8">
                  <div className="upcoming-item__description">
                    <h6 className="upcoming-item__title">
                      <a href="event-details.html">{project.title}</a>
                    </h6>
                    <p>{project.description}</p>
                    <div className="upcoming-item__details">
                      <p>
                        <svg className="icon">
                        </svg>
                        <strong>Start:</strong> {formatDate(startDate)} -
                        <strong> End:</strong> {formatDate(endDate)}
                      </p>
                     
                    </div>
                    <Link to={`/projects/${project._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
