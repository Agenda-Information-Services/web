import apiClient from "../apiClient";

const updateProfileAPI = async (updateData) => {
    try {
        const response = await apiClient.put("/update/profile", updateData);
        return {
            status: response.status,
            body: response.data,
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            message: error.response?.data?.message || "회원정보 수정 중 오류 발생",
        };
    }
};

export default updateProfileAPI;
