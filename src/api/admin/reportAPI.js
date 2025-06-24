import apiClient from "../apiClient";

// 1. 특정 사용자가 신고한 게시글 리스트 조회
export const getReportedPostsByUser = async (userId) => {
    const res = await apiClient.get(`/api/admin/report/list?userId=${userId}`);
    return res.data;
};

// 2. 신고 게시글 상세 조회
export const getReportDetail = async (reportId) => {
    const res = await apiClient.get(`/api/admin/report/${reportId}`);
    return res.data;
};
