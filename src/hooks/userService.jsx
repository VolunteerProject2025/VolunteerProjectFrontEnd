import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

export const getAllUsers = () => {
    return axios.get(API_URL);
};

export const getAllOrgPending = () => {
    return axios.get(`${API_URL}/pending`);
};

export const getAllOrgw = () => {
    return axios.get(API_URL);
};

export const getAllOrg2 = () => {
    return axios.get(API_URL);
};