// src/api/admin/userAPI.js

import apiClient from "../apiClient";

export const getAllUsers = async () => {
    const res = await apiClient.get("/admin/users");
    return res.data?.content ?? [];
};

export const getReportedPostsByUser = async (userId) => {
    const res = await apiClient.get(`/admin/report/list?userId=${userId}`);
    return res.data;
};

export const getUserDetail = async (userId) => {
    const res = await apiClient.get(`/admin/users/${userId}`);
    return res.data;
};

export const getReportDetail = async (reportId) => {
    const res = await apiClient.get(`/admin/report/${reportId}`);
    return res.data;
};

export const suspendUser = async (userId) => {
    return await apiClient.put(`/admin/user/suspend/${userId}`);
};

export const resumeUser = async (userId) => {
    return await apiClient.put(`/admin/user/resume/${userId}`);
};
