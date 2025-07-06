import api from "./index";

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  const { accessToken } = response.data;
  localStorage.setItem("token", accessToken);
  return response.data;
};

export const signup = async (userData) => {
  return await api.post("/auth/signup", userData);
};

export const logout = () => {
  localStorage.removeItem("token");
  // Optionally, you could also make an API call to a /logout endpoint if the backend supports it.
};
