import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DateRangeModal from "../components/common/Modal/DateRangeModal";
import TimeSelectModal from "../components/common/Modal/TimeSelectModal";
import TransportSelectModal from "../components/common/Modal/TransportSelectModal";

// 페이지 전체 래퍼
const PageWrapper = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

// 제목
const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2d3748;
  text-align: center;
`;

// 설명
const Description = styled.p`
  font-size: 1.1rem;
  color: #4a5568;
  text-align: center;
  margin-bottom: 3rem;
`;

// 시작 버튼
const StartButton = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  transition: background-color 0.2s;

  &:hover {
    background: #1d4ed8;
  }
`;

const StartPlannerPage = () => {
  const navigate = useNavigate();
  
  // 모달 상태 관리
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  
  // 선택된 데이터 상태
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  
  // 모달 단계 관리
  const [currentStep, setCurrentStep] = useState(1);

  // 날짜 선택 완료 핸들러
  const handleDateSelect = (dateRange) => {
    setSelectedDateRange(dateRange);
    setShowDateModal(false);
    setShowTimeModal(true);
    setCurrentStep(2);
  };

  // 시간 선택 완료 핸들러
  const handleTimeSelect = (times) => {
    setSelectedTimes(times);
    setShowTimeModal(false);
    setShowTransportModal(true);
    setCurrentStep(3);
  };

  // 교통편 선택 완료 핸들러
  const handleTransportSelect = (transport) => {
    setSelectedTransport(transport);
    setShowTransportModal(false);
    
    // 모든 정보가 완료되면 PlannerPage로 이동
    navigate("/planner", {
      state: {
        departure: "서울",
        arrival: "부산", 
        date: selectedDateRange.startDate,
        transport: transport
      }
    });
  };

  // 교통편 다음 단계 핸들러 (가는 날 선택 후 오는 날 선택)
  const handleTransportNext = (goTransport) => {
    setSelectedTransport({ go: goTransport });
    setCurrentStep(4); // 오는날 단계로 변경
  };

  // 이전 단계로 돌아가기
  const handleBack = () => {
    if (currentStep === 4) {
      // 오는날에서 가는날로 돌아가기
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // 가는날에서 시간 선택으로 돌아가기
      setShowTransportModal(false);
      setShowTimeModal(true);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // 시간 선택에서 날짜 선택으로 돌아가기
      setShowTimeModal(false);
      setShowDateModal(true);
      setCurrentStep(1);
    }
  };

  return (
    <PageWrapper>
      <Title>🚀 여행 계획 시작하기</Title>
      <Description>
        간단한 몇 단계를 거쳐 최적의 여행 일정을 만들어보세요!
      </Description>
      
      <StartButton onClick={() => setShowDateModal(true)}>
        여행 계획 시작하기
      </StartButton>

      {/* 날짜 범위 선택 모달 */}
      {showDateModal && (
        <DateRangeModal
          onClose={() => setShowDateModal(false)}
          onSelect={handleDateSelect}
        />
      )}

      {/* 시간 선택 모달 */}
      {showTimeModal && selectedDateRange && (
        <TimeSelectModal
          startDate={selectedDateRange.startDate}
          endDate={selectedDateRange.endDate}
          onClose={() => setShowTimeModal(false)}
          onSelect={handleTimeSelect}
        />
      )}

      {/* 교통편 선택 모달 */}
      {showTransportModal && selectedTimes && selectedDateRange && (
        <TransportSelectModal
          date={currentStep === 3 ? selectedDateRange.startDate : selectedDateRange.endDate}
          time={currentStep === 3 ? selectedTimes.startDepart : selectedTimes.endDepart}
          mode={currentStep === 3 ? "go" : "return"}
          onSelect={handleTransportSelect}
          onNext={currentStep === 3 ? handleTransportNext : undefined}
          onClose={() => setShowTransportModal(false)}
          onBack={currentStep === 4 ? handleBack : undefined}
        />
      )}
    </PageWrapper>
  );
};

export default StartPlannerPage;
