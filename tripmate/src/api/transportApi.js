import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 요청 제한시간 10초
});

// 교통편 추천 요청 (POST)
export const recommendTransport = (payload) => {
  return apiClient.post("/transport/search", payload);
};

// 필요하면 GET 요청 함수도 추가 가능
export const getTransportByQuery = ({ departure, arrival, date }) => {
  return apiClient.get("/transport/search", {
    params: { departure, arrival, date },
  });
};
