import apiClient from "../apiClient";


export const reportPost = async (postId, reason) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const payload = {
      targetId: Number(postId),
      targetType: "POST",
      reason: reason?.trim(),
    };

    console.log("게시글 신고 요청 payload (POST):", payload);

    const response = await apiClient.post("/report/create", payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("게시글 신고 중 오류:", error);
    if (error.response?.status === 404) {
      throw new Error("해당하는 사용자가 없습니다.");
    }
    throw error;
  }
};

export const reportComment = async (commentId, reason) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const payload = {
      targetId: Number(commentId),
      targetType: "COMMENT",
      reason: reason,
    };

    console.log("댓글 신고 요청 payload (COMMENT):", payload);

    const response = await apiClient.post("/report/create", payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("댓글 신고 중 오류:", error);
    if (error.response?.status === 404) {
      throw new Error("해당하는 사용자가 없습니다.");
    }
    throw error;
  }
};
