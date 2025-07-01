import axios from "axios";

const BASE_URL = "http://localhost:8080"; // 백엔드 서버 주소

export const generateSchedule = async ({ departure, arrival, date, transportType }) => {
  return axios.post(`${BASE_URL}/schedule/auto-generate`, {
    departure,
    arrival,
    date,
    transportType
  });
};

export const generateMultiDaySchedule = (data) => {
  return axios.post("http://localhost:8080/schedule/generate-multi", data);
};
