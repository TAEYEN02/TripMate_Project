import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TransportForm from "../componets/transport/TransportForm";
import TransportResultCard from "../componets/transport/TransportResultCard";
import { searchTransport } from "../api/transportApi";

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

// 버튼 래퍼 (여백 조절용)
const ButtonWrapper = styled.div`
  margin-top: 1rem; /* mt-4 */
`;

// 버튼
const PrimaryButton = styled.button`
  background-color: #48bb78; /* bg-green-500 */
  color: white;
  padding: 0.5rem 1rem; /* py-2 px-4 */
  border-radius: 0.375rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #38a169; /* bg-green-600 */
  }
`;

const StartPlannerPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    departure: "",
    arrival: "",
    date: "",
  });

  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await searchTransport(form);
      setResult(res);
    } catch (err) {
      console.error("교통편 조회 실패:", err);
    }
  };

  const handleGoToPlanner = () => {
    navigate("/planner", { state: { ...form, transport: result } });
  };

  return (
    <PageWrapper>
      <Title>여행 계획 시작하기</Title>
      <TransportForm form={form} setForm={setForm} onSubmit={handleSearch} />

      {result && (
        <>
          <TransportResultCard result={result} />
          <ButtonWrapper>
            <PrimaryButton onClick={handleGoToPlanner}>
              자동 일정 생성하기 →
            </PrimaryButton>
          </ButtonWrapper>
        </>
      )}
    </PageWrapper>
  );
};

export default StartPlannerPage;
