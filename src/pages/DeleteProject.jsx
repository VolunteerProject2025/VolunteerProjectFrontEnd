import { useEffect, useState } from "react";

export function DeleteProject  ()  {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const response = await fetch(`http://localhost:3000/projects/${id}`, { method: "DELETE" });

      const data = await response.json();
      alert(data.success ? "Project deleted!" : data.message);

      setProjects((prev) => prev.filter((project) => project._id !== id));
    }
  };

  return (
    <div>
      <h2>Delete Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            {project.title}
            <button onClick={() => handleDelete(project._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
