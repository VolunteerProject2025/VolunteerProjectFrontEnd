import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateProject from "./components/CreateProject";
import ProjectsList from "./components/ProjectList";
import ProjectDetails from "./components/ProjectDetails";
import UpdateProject from "./components/UpdateProject";
import DeleteProject from "./components/DeleteProject";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectsList />} />
        <Route path="/create" element={<CreateProject />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/projects/:id/edit" element={<UpdateProject />} />
        <Route path="/delete" element={<DeleteProject />} />
      </Routes>
    </Router>
  );
}

export default App;