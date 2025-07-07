import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:10000/api",
});

// 요청 인터셉터: 로컬 스토리지에서 토큰을 가져와 모든 요청 헤더에 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ 여기 수정
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;
