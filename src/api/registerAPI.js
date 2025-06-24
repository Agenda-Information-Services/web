import apiClient from "../../src/api/apiClient";

const registerAPI = async (userData) => {
    try {
        const response = await apiClient.post('/register', userData);
        return {
            status: response.status,
            body: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            message: error.message
        };
    }
};

export default registerAPI;