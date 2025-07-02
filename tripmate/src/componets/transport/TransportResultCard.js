import React from "react";
import styled from "styled-components";

const ResultWrapper = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
`;

const OptionCard = styled.div`
  border: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
  white-space: pre-wrap;
`;

const TransportResultCard = ({ result }) => {
  return (
    <ResultWrapper>
      <Title>버스 추천 교통편</Title>
      {result.busOptions.map((option, idx) => (
        <OptionCard key={`bus-${idx}`}>{option}</OptionCard>
      ))}

      <Title>열차 추천 교통편</Title>
      {result.korailOptions.map((option, idx) => (
        <OptionCard key={`korail-${idx}`}>{option}</OptionCard>
      ))}
    </ResultWrapper>
  );
};

export default TransportResultCard;
