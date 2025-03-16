import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { useEffect, useContext, useState } from "react";

export function ProjectListOrg() {
  const [projects, setProjects] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Destructure organization correctly
  const { organization } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const orgId = organization?.organization?._id;
        
        if (!orgId) {
          setError("No organization selected");
          setLoading(false);
          return;
        }
  
        const response = await axios.get(`http://localhost:3000/projects/${orgId}/org`, { 
          withCredentials: true 
        });
  
        setProjects(response.data.projects || []);
  
        // Optionally handle the message if needed
        if (response.data.message) {
          console.log(response.data.message);
        }
  
      } catch (error) {
        // Error handling remains the same
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjects();
  }, [organization]);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>{error}</p>; 
  if (!projects.length) return <p>No projects found.</p>; 

  return (
    <div className="col-xl-10 offset-xl-1">
      <h2>Project List</h2>
      {projects.map((project) => {
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
                          <use xlinkHref="#clock"></use>
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