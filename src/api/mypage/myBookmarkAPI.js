import apiClient from "../apiClient";

export const getMyBookmarks = async () => {
    try {
        const response = await apiClient.get('/bookmarks');
        return response.data;
    } catch (error) {
        console.error("북마크 목록을 불러오는 중 오류 발생:", error);
        throw error;
    }
};