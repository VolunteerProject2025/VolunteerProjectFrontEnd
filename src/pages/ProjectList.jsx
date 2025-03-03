import { useState, useEffect } from "react";
import { fetchProjects, deleteProject } from "../hooks/api";
import {CreateProject} from "./CreateProject";

export function ProjectList  ()  {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetchProjects();
      setProjects(response.data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
      loadProjects();
    }
  };

  return (
    <div className="container">
      <h2>Project List</h2>
      <CreateProject project={editingProject} onRefresh={loadProjects} />
      <ul>
        {projects.map((project) => (
          <li key={project._id} className="project-item">
            <div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <div>
              <button onClick={() => setEditingProject(project)} className="btn-primary">
                Edit
              </button>
              <button onClick={() => handleDelete(project._id)} className="btn-danger">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
