import axios from 'axios';

const API_URL = 'http://localhost:3000/post';

export const getPosts = () => {
    return axios.get(API_URL);
};

export const getPostById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export const createPost = (post) => {
    return axios.post(API_URL, post);
};

export const updatePost = (id, post) => {
    return axios.put(`${API_URL}/${id}`, post);
};

export const deletePost = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

// Like a post
export const likePost = async (id, data) => {
    return await axios.post(`${API_URL}/${id}/like`, data);
};

// Add a comment
export const addComment = async (id, data) => {
    return await axios.post(`${API_URL}/${id}/comment`, data);
};