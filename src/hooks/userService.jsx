import axios from 'axios';

const API_URL = 'http://localhost:3000/users';
const API_VOL = 'http://localhost:3000/volunteers';
const API_ORG = 'http://localhost:3000/organizations';

export const getAllUsers = () => {
    return axios.get(API_URL,{ withCredentials: true });
};

export const inActiveUser = (id) => {
    return axios.put(`${API_URL}/${id}/in-active`,{ withCredentials: true });
};

export const activeUser = (id) => {
    return axios.put(`${API_URL}/${id}/active`,{ withCredentials: true });
};

export const getDetailUserById = (id, role) => {
    if (role === 'Volunteer') {
        return axios.get(`${API_VOL}/user/${id}`,{ withCredentials: true });
    } else {
        return axios.get(`${API_ORG}/${id}/details`,{ withCredentials: true });
    }
};