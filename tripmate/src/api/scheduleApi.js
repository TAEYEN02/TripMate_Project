import api from "./index";

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

// 다일정 자동 생성
export const generateMultiSchedule = async ({ departure, arrival, date, days }) => {
  const response = await api.post("/schedule/generate-multi", {
    departure,
    arrival,
    date,
    days
  });
  return response.data; // MultiDayScheduleResponse
};
