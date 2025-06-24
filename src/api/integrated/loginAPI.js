import apiClient from "../apiClient";

const loginUser = async (loginData) => {
    try {
        const response = await apiClient.post('/login', loginData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const { accessToken, name, uid, role, userId, email, phoneNumber, nickName } = response.data;

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("username", name);
            localStorage.setItem("uid", uid);
            localStorage.setItem("role", role);
            localStorage.setItem("userId", userId);
            localStorage.setItem("email", email);
            localStorage.setItem("phoneNumber", phoneNumber);
            localStorage.setItem("nickName", nickName);
            console.log('localStorage 저장 완료');
        }

        return {
            status: response.status,
            body: response.data,
        };
    } catch (error) {
        const res = error.response;
        return {
            status: res?.status || 500,
            code: res?.data?.code,
            message: res?.data?.message || "서버 오류가 발생했습니다.",
        };
    }
};

export default loginUser;
