import axios from 'axios';

// FIXED: Added /api/auth to the end to match your Spring Boot controllers!
const API_URL = 'https://deskmind-3kq3.onrender.com/api/auth'; 

const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });
            
            // If Spring Boot gives us a token, save it securely in the browser
            if (response.data && response.data.token) {
                localStorage.setItem('userToken', response.data.token);
            }
            return response.data;
        } catch (error) {
            // Throw the error message from the backend so the UI can display it
            throw error.response?.data || "Login failed to connect to server";
        }
    },

    register: async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                name,
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || "Registration failed";
        }
    },

    logout: () => {
        localStorage.removeItem('userToken');
    },

    forgotPassword: async (email) => {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || "Failed to send OTP";
        }
    },

    resetPassword: async (email, otp, newPassword) => {
        try {
            const response = await axios.post(`${API_URL}/reset-password`, { 
                email, 
                otp, 
                newPassword 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || "Failed to reset password";
        }
    },

    getCurrentToken: () => {
        return localStorage.getItem('userToken');
    }
};

export default authService;