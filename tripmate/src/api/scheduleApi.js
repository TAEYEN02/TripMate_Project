import axios from "axios";

export const generateSchedule = async (data) => {
  const response = await axios.post('/api/schedules/auto-generate', data);
  return response.data;
};