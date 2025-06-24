import apiClient from "../apiClient";

const bookmarkRankingAPI = async () => {
    try {
        const response = await apiClient.get('/bills/ranking/bookmark');
        return response.data;
    } catch (error) {
        console.error('북마크 랭킹 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

export default bookmarkRankingAPI; 