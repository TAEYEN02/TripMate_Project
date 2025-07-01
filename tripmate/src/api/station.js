import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🚄 기차역 목록 조회 (도시별)
export const fetchCityStationMap = async () => {
  const response = await apiClient.get("/stations"); // KorailUtil
  return response.data; // Map<String, List<StationInfo>>
};

// 🚄 특정 도시 기차역 조회
export const fetchStationsByCity = async (city) => {
  const response = await apiClient.get(`/station/city?city=${city}`);
  return response.data;
};

// 🚌 버스터미널 목록 조회 (도시별)
export const fetchBusTerminalMap = async () => {
  const response = await apiClient.get("/terminals"); // BusUtil에 따름
  return response.data; // Map<String, List<TerminalInfo>>
};

// 🚌 특정 도시 터미널 목록 조회
export const fetchTerminalsByCity = async (city) => {
  const response = await apiClient.get(`/terminals/city?city=${city}`);
  return response.data;
};
