import React, { useState } from "react";
import styled from "styled-components";
import TransportSelector from "../componets/transport/TransportSelector";
import TransportResultCard from "../componets/transport/TransportResultCard";
import { recommendTransport } from "../api/transportApi";
import { useNavigate } from "react-router-dom";

const PageWrapper = styled.div`
  padding: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2d3748;
`;

const ButtonWrapper = styled.div`
  margin-top: 1rem;
`;

const PrimaryButton = styled.button`
  background-color: #48bb78;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #38a169;
  }
`;

const Loading = styled.div`
  margin-top: 2rem;
  font-size: 1.25rem;
  color: #38a169;
  font-weight: 600;
  text-align: center;
`;

const StartPlannerPage = () => {
  const [form, setForm] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (searchForm) => {
    setForm(searchForm);
    setResult(null);
    setLoading(true);
    try {
      const res = await recommendTransport(searchForm);
      setResult(res.data);
    } catch (err) {
      console.error("교통편 조회 실패:", err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToPlanner = () => {
    navigate("/planner", { state: { form, result } });
  };

  return (
    <PageWrapper>
      <Title>여행 계획 시작하기</Title>
      <TransportSelector onSubmit={handleSearch} />

      {loading && <Loading>교통편을 조회 중입니다...</Loading>}

      {result && !loading && (
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
