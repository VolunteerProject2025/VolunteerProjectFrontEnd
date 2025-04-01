import axios from 'axios';

const API_URL = 'http://localhost:3000/feedbacks';

export const getAllFeedbacks = () => {
    return axios.get(API_URL,{ withCredentials: true });
};

export const getAllOrgPending = () => {
    return axios.get(`${API_URL}/pending`,{ withCredentials: true });
};

export const getAllOrgw = () => {
    return axios.get(API_URL,{ withCredentials: true });
};
export const getAdminDashboard = () => {
    return axios.get(`http://localhost:3000/admin`, { withCredentials: true });
};
export const getAllOrg2 = () => {
    return axios.get(API_URL,{ withCredentials: true });
};