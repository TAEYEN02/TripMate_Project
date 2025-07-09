import api from "./index";

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  const { accessToken } = response.data;
  localStorage.setItem("token", accessToken);

  let meResponseData = null;
  try {
    const meResponse = await api.get("/auth/me");
    meResponseData = meResponse.data;
    localStorage.setItem("user", JSON.stringify(meResponseData));
    console.log("Fetched user data:", meResponseData); // 디버깅용
  } catch (meError) {
    console.error("Failed to fetch user data after login:", meError); // 디버깅용
    localStorage.removeItem("token"); // 실패 시 토큰 제거
    localStorage.removeItem("user");
    throw meError; // 에러 전파
  }

  return { ...response.data, user: meResponseData };
};

export const signup = async (userData) => {
  return await api.post("/auth/signup", userData);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getMe = async () => {
  return await api.get("/auth/me");
};
