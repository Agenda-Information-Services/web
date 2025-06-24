import apiClient from "../apiClient";

const voteAPI = async (billId, voteType) => {
    try {
        const response = await apiClient.post(`/bills/${billId}/vote?voteType=${voteType}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default voteAPI;