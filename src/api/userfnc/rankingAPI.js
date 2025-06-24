import apiClient from "../apiClient";

const rankingAPI = async () => {
    try {
        const response = await apiClient.get('/bills/ranking');
        return response.data;
    } catch (error) {
        console.error('랭킹 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

export default rankingAPI;