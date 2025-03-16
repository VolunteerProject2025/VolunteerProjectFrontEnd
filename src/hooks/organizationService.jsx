import axios from 'axios';

const API_URL = 'http://localhost:3000/organizations';

export const getAllOrg = () => {
    return axios.get(API_URL);
};

export const getAllOrgPending = () => {
    return axios.get(`${API_URL}/pending`);
};

export const approveOrgw = (id) => {
    return axios.put(`${API_URL}/${id}/approve`);
};

export const getAllOrg2 = () => {
    return axios.get(API_URL);
};