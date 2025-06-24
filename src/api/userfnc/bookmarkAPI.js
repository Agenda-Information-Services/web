import apiClient from "../apiClient";

const createBookmark = async (billId) => {
    try {
        const response = await apiClient.post(`/bookmarks/${billId}`);
        return response.data;
    } catch (error) {
        console.error('북마크 생성 중 오류:', error);
        throw error;
    }
};

const deleteBookmark = async (billId) => {
    try {
        const response = await apiClient.delete(`/bookmarks/${billId}`);
        return response.data;
    } catch (error) {
        console.error('북마크 삭제 중 오류:', error);
        throw error;
    }
};

const getBookmarks = async () => {
    try {
        const response = await apiClient.get('/bookmarks');
        // 응답 형식: [{ billId, billTitle, proposerName }, ...]
        return response.data;
    } catch (error) {
        console.error('북마크 목록 조회 중 오류:', error);
        throw error;
    }
};

const bookmarkAPI = {
    createBookmark,
    deleteBookmark,
    getBookmarks
};

export default bookmarkAPI;