import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/projects`; // Adjust this based on your backend route

// ✅ Fetch all projects
export const fetchProjects = async () => {
    try {
        const response = await axios.get(API_URL, { withCredentials: true });
        return response.data; // Returns the list of projects
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};

// ✅ Delete a project by ID
export const deleteProject = async (projectId) => {
    try {
        const response = await axios.delete(`${API_URL}/${projectId}`, { withCredentials: true });
        return response.data; // Returns success message or status
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
};
