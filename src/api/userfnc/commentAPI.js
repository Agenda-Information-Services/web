import apiClient from "../apiClient";

export const createComment = async (postId, commentContent, parentId = null) => {
    const userId = localStorage.getItem("uid");
    const response = await apiClient.post(`/comments`, {
        postId,
        commentContent,
        parentCommentId: parentId,
        userId
    });
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
};

export const editComment = async (commentId, commentContent) => {
    const userId = localStorage.getItem("uid");
    const response = await apiClient.put(`/comments/${commentId}`, {
        userId,
        commentContent,
    });
    return response.data;
};

export const getCommentsByPostId = async (postId) => {
    const response = await apiClient.get(`/comments/${postId}`);
    return response.data;
};

export const reportComment = async (targetId, reason) => {
    const uid = localStorage.getItem("uid");
    const response = await apiClient.post('/report/create', {
        targetId,
        targetType: 'COMMENT',
        reason,
    });
    return response.data;
};