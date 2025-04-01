import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/projects`;

export const getAllProjects = () => {
    return axios.get(API_URL, { withCredentials: true });
};
export const approveProject = (id) => {
    return axios.get(`${API_URL}/${id}/approve`, { withCredentials: true });
};
export const getAllOrgw = () => {
    return axios.get(API_URL, { withCredentials: true });
};
export const getPendingProjects = () => {
    return axios.get(`${API_URL}/pending`, { withCredentials: true });
};
export const rejectProject = (id) => {
    return axios.get(`${API_URL}/${id}/reject`, { withCredentials: true });
};
export const getPendingVolunteers = (id) => {
    return axios.get(`${API_URL}/${id}/pending-volunteer`, { withCredentials: true });
};
export const rejectVolunteerToProject = (volunteerId, projectId) => {
    return axios.put(`${API_URL}/${volunteerId}/${projectId}/rejectVolunteer`, { withCredentials: true });
};
export const approveVolunteerToProject = (volunteerId, projectId) => {
    return axios.put(`${API_URL}/${volunteerId}/${projectId}/approveVolunteer`, { withCredentials: true });
};
export const getDetailProject = (id) => {
    return axios.get(`${API_URL}/${id}`, { withCredentials: true });
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
export const getProjectsByOrgId = async (organizationId) => {
    const response = await axios.get(`${API_URL}/organization/${organizationId}`, { withCredentials: true });
    console.log(response.data);

    return response;
};