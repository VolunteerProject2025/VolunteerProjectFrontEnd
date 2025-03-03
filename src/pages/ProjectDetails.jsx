import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function ProjectDetails  ()  {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/projects/${id}`)
      .then((res) => res.json())
      .then((data) => setProject(data.data));
  }, [id]);

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <p>Status: {project.status}</p>
      <p>Start Date: {project.startDate}</p>
      <p>End Date: {project.endDate}</p>
    </div>
  );
};
