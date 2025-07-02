import React, { useState } from "react";
import axios from "axios";
import TransportForm from "./TransportForm";
import styled from "styled-components";

// 페이지 전체 래퍼
const PageWrapper = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: "Segoe UI", sans-serif;
`;

// 결과 리스트 제목
const SectionTitle = styled.h3`
  font-size: 1.25rem;
  margin-top: 2rem;
  color: #2b6cb0;
`;

// 각 결과 리스트 래퍼
const ResultList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// 각 결과 항목 카드
const ResultItem = styled.li`
  padding: 1rem;
  background-color: #edf2f7;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e0;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const TransportPage = () => {
  const [form, setForm] = useState({
    departure: "",
    arrival: "",
    date: "",
  });

  const [results, setResults] = useState({ korailOptions: [], busOptions: [] });

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/transport/search", form);
      setResults(response.data);
    } catch (err) {
      console.error("교통편 조회 실패:", err);
      alert("교통편 조회 중 오류가 발생했습니다.");
    }
  };

  return (
    <PageWrapper>
      <TransportForm form={form} setForm={setForm} onSubmit={handleSubmit} />

      <SectionTitle>🚄 열차 결과</SectionTitle>
      <ResultList>
        {results.korailOptions.map((item, index) => (
          <ResultItem key={`korail-${index}`}>{item}</ResultItem>
        ))}
      </ResultList>

      <SectionTitle>🚌 버스 결과</SectionTitle>
      <ResultList>
        {results.busOptions.map((item, index) => (
          <ResultItem key={`bus-${index}`}>{item}</ResultItem>
        ))}
      </ResultList>
    </PageWrapper>
  );
};

export default TransportPage;
