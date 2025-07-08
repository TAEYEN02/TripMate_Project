import api from './index';

// 유저 프로필 조회
export const fetchUserProfile = async (paramUserId, user) => {
    if (paramUserId) {
        const response = await api.get(`/users/${paramUserId}`);
        return response.data;
    }
    if (user) {
        return user;
    }
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
};

// 스케줄 목록 조회
export const fetchSchedules = async (localUser) => {
    if (!localUser) {
        console.warn("localUser 없음, fetchSchedules 중단");
        return [];
    }

    const endpoint = '/schedule/my-schedules';

    const token = localStorage.getItem("token");
    if (!token) {
        console.warn("🚫 토큰 없음, 요청 중단");
        return [];
    }

    try {
        const response = await api.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(" 응답 데이터:", response.data);

        if (!Array.isArray(response.data)) {
            throw new Error('여행 계획 데이터가 올바르지 않습니다.');
        }

        return response.data;
    } catch (error) {
        console.error("🚨 fetchSchedules 에러:", error);
        throw error;
    }
};

//여행 계획 일정 공유
export const fetchSharedSchedules = async (userId) => {
    if (!userId) {
        console.warn("userId 없음, fetchSharedSchedules 중단");
        return [];
    }

    const endpoint = `/schedule/shared/my`; // userId가 필요하다면 경로 수정 필요

    const token = localStorage.getItem("token");
    if (!token) {
        console.warn("🚫 토큰 없음, 요청 중단");
        return [];
    }

    try {
        const response = await api.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!Array.isArray(response.data)) {
            throw new Error('내가 공유한 여행 계획 데이터가 올바르지 않습니다.');
        }

        return response.data;
    } catch (error) {
        console.error("🚨 fetchSharedSchedules 에러:", error);
        throw error;
    }
};
