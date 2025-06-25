import React from "react";
import styled from "styled-components";

// 전체 결과 래퍼
const ResultWrapper = styled.div`
  margin-top: 1.5rem; /* mt-6 */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
`;

// 제목
const Title = styled.h2`
  font-size: 1.125rem; /* text-lg */
  font-weight: 600;
  color: #2d3748;
`;

// 교통 옵션 카드
const OptionCard = styled.div`
  border: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

// 텍스트
const InfoText = styled.p`
  font-size: 0.95rem;
  color: #4a5568;
  margin: 0.25rem 0;
`;

const TransportResultCard = ({ result }) => {
  return (
    <ResultWrapper>
      <Title>추천 교통편</Title>
      {result.options.map((option, idx) => (
        <OptionCard key={idx}>
          <InfoText>종류: {option.type}</InfoText>
          <InfoText>출발 시간: {option.departureTime}</InfoText>
          <InfoText>도착 시간: {option.arrivalTime}</InfoText>
          <InfoText>가격: {option.price}원</InfoText>
        </OptionCard>
      ))}
    </ResultWrapper>
  );
};

export default TransportResultCard;
