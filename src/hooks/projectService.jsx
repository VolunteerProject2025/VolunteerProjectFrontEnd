import axios from 'axios';

const API_URL = 'http://localhost:3000/projects';

export const getAllProjects = () => {
    return axios.get(API_URL,{ withCredentials: true });
};

export const approveProject = (id) => {
    return axios.get(`${API_URL}/${id}/approve`,{ withCredentials: true });
};
export const deleteProject = async (projectId) => {
    try {
        const response = await axios.delete(`${API_URL}/${projectId}`, { withCredentials: true });
        return response.data; // Returns success message or status
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
};
export const fetchProjects = async () => {
    try {
        const response = await axios.get(API_URL, { withCredentials: true });
        console.log(response);
        return response.data; // Returns the list of projects
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};
export const getAllOrgw = () => {
    return axios.get(API_URL,{ withCredentials: true });
};
export const getPendingProjects = () => {
    return axios.get(`${API_URL}/pending`,{ withCredentials: true });
};
export const getAllOrg2 = () => {
    return axios.get(API_URL,{ withCredentials: true });
};
export const rejectProject = (id) => {
    return axios.get(`${API_URL}/${id}/reject`,{ withCredentials: true });
};
export const getProjectsByOrgId = async (organizationId) => {
    const response = await axios.get(`${API_URL}/organization/${organizationId}`,{ withCredentials: true });
    console.log(response.data);
    
    return response;
};