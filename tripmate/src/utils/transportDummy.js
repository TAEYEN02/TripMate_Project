// 더미 교통편 데이터 생성 함수
export function generateDummyTransports({ type, date, startHour = 6, endHour = 24 }) {
  // type: "train" | "bus"
  // date: "2024-06-26" (yyyy-mm-dd)
  // 1시간 간격으로 시간표 생성
  const result = [];
  for (let hour = startHour; hour < endHour; hour += 1) {
    // 각 시간대별 교통편 객체 생성
    result.push({
      id: `${type}-${date}-${hour}`,
      type,
      date,
      departureTime: `${hour.toString().padStart(2, "0")}:00`,
      arrivalTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
      departure: "서울",
      arrival: "부산",
      price: type === "train" ? 35000 : 25000,
    });
  }
  return result; // 생성된 교통편 리스트 반환
} 