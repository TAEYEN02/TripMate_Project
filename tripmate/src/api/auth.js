import api from "./index";

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  const { accessToken } = response.data;
  localStorage.setItem("token", accessToken);

  const meResponse = await api.get("/auth/me"); 
  localStorage.setItem("user", JSON.stringify(meResponse.data));

  return { ...response.data, user: meResponse.data };
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
