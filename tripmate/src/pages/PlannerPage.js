import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { generateSchedule } from "../api/scheduleApi";
import ScheduleTimeline from "../componets/planner/ScheduleTimeline";

// 페이지 전체 래퍼
const PageWrapper = styled.div`
  padding: 1.5rem; /* p-6 */
`;

// 제목
const Title = styled.h2`
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700;
  margin-bottom: 1rem; /* mb-4 */
  color: #2d3748;
`;

// 상태 메시지 (로딩, 에러)
const StatusMessage = styled.p`
  padding: 1rem; /* p-4 */
  color: ${(props) => (props.error ? "#e53e3e" : "#4a5568")}; /* text-red-500 or 기본 */
`;

const PlannerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { departure, arrival, date, transport } = location.state || {};

  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!departure || !arrival || !date) {
      setError("필수 정보가 누락되었습니다. 다시 시도해주세요.");
      navigate("/planner");
      return;
    }

    const fetchSchedule = async () => {
      try {
        const res = await generateSchedule({ departure, arrival, date });
        setSchedule(res);
      } catch (err) {
        console.error("일정 생성 실패:", err);
        setError("일정 생성 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [departure, arrival, date, navigate]);

  if (loading) return <StatusMessage>⏳ 일정을 생성 중입니다...</StatusMessage>;
  if (error) return <StatusMessage error>{error}</StatusMessage>;

  return (
    <PageWrapper>
      <Title>📍 자동 생성된 일정</Title>
      <ScheduleTimeline schedule={schedule} />
    </PageWrapper>
  );
};

export default PlannerPage;
