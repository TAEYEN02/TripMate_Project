import api from "./index";
import dayjs from "dayjs";

// 단일 일정 자동 생성
export const autoGenerateSchedule = async ({ departure, arrival, date, transportType }) => {
  const response = await api.post("/schedule/auto-generate", {
    departure,
    arrival,
    date,
    transportType
  });
  return response.data; // ScheduleResponse
};

export const fetchRecommendedPlaces = async (keyword) => {
  const response = await api.get(`/places/recommend?keyword=${keyword}`);
  return response.data; // List<PlaceDTO>
};

// 다일정 생성 API
export const generateMultiSchedule = async ({ departure, arrival, date, days }) => {
  const response = await api.post("/schedule/generate-multi", {
    departure,
    arrival,
    date,
    days,
  });
  return response.data;
};

// 일정 저장 (내 일정 추가하기)
export const saveSchedule = async (schedule) => {
  const allPlaces = Object.values(schedule.dailyPlan || {}).flat(); // 모든 날짜의 장소들을 합쳐서 하나의 리스트로

  const payload = {
    departure: schedule.departure,
    arrival: schedule.arrival,
    date: schedule.startDate, // ex: "2025-07-09"
    days: schedule.days || 1,
    transportType: schedule.goTransport?.split("|")[0] || "korail",
    startTime: dayjs(schedule.startDate).hour(9).minute(0).second(0).toISOString(), // 예: 09:00
    endTime: dayjs(schedule.startDate).hour(18).minute(0).second(0).toISOString(), // 예: 18:00
    places: allPlaces,
  };

  const response = await api.post("/schedule", payload);
  return response.data;
};