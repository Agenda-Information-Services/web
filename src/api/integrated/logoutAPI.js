import apiClient from "../apiClient";

const logoutAPI = async () => {
    try {
        const response = await apiClient.post('/logout');
        return {
            status: response.status,
            body: response.data,
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            code: error.response?.data?.code,
            message: error.response?.data?.message || "로그아웃 실패",
        };
    }
};

export default logoutAPI;
