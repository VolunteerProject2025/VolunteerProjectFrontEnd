import axios from 'axios';

const API_URL = 'http://localhost:3000/projects';

export const getAllProjects = () => {
    return axios.get(API_URL);
};

export const approveProject = (id) => {
    return axios.get(`${API_URL}/${id}/approve`);
};

export const getAllOrgw = () => {
    return axios.get(API_URL);
};

export const getAllOrg2 = () => {
    return axios.get(API_URL);
};