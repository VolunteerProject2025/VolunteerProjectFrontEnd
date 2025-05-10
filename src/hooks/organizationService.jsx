import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/organizations`;
export const getAllOrg = () => {
    return axios.get(API_URL, {}, { withCredentials: true });
};
export const createOrg = (orgData) => {
    return axios.post(API_URL, orgData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const getAllOrgPending = () => {
    return axios.get(`${API_URL}/pending`, {}, {
        withCredentials: true,
         headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const approveOrgw = (id) => {
    return axios.put(`${API_URL}/${id}/approve`, {}, { withCredentials: true });
};

export const getAllOrg2 = () => {
    return axios.get(API_URL, {}, { withCredentials: true });
};
export const editOrg = async (orgData) => {
    try {
        const response = await axios.put(`${API_URL}/edit-org`, orgData, { withCredentials: true });
        return response;
    } catch (error) {
        throw error;
    }
};