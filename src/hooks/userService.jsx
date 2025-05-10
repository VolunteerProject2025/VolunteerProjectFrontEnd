import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

export const getAllUsers = () => {
    return axios.get(API_URL,{ withCredentials: true });
};

export const inActiveUser = (id) => {
    return axios.put(`${API_URL}/${id}/in-active`,{ withCredentials: true });
};

export const activeUser = (id) => {
    return axios.put(`${API_URL}/${id}/active`,{ withCredentials: true });
};

export const getAllOrg2 = () => {
    return axios.get(API_URL,{ withCredentials: true });
};