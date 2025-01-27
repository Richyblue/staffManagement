import axios from 'axios';

const API_BASE_URL =process.env.REACT_APP_BASE_URL; // Replace with your API base URL

// Register API
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}register`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Login API
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
