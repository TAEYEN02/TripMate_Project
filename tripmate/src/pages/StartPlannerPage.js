import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DateRangeModal from "../componets/common/Modal/DateRangeModal";
import TimeSelectModal from "../componets/common/Modal/TimeSelectModal";
import TransportSelectModal from "../componets/common/Modal/TransportSelectModal";
import { getTransportInfo } from "../api/transportApi";

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
  // { visible: boolean, mode: "go" | "return" }
  const [showTransportModal, setShowTransportModal] = useState({ visible: false, mode: "go" });
  
  // 선택된 데이터 상태
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState(null);

  // 교통편 데이터 캐싱 (조합별)
  const [transportCache, setTransportCache] = useState({}); // { key: data }
  const [currentTransportData, setCurrentTransportData] = useState(null); // 현재 모달에 보여줄 데이터

  // 사용자가 선택한 교통편 (가는날/오는날)
  const [selectedGoTransport, setSelectedGoTransport] = useState(null);
  const [selectedReturnTransport, setSelectedReturnTransport] = useState(null);
  
  // 모달 단계 관리
  const [currentStep, setCurrentStep] = useState(1);
  // 로딩 상태 분리
  const [loadingGo, setLoadingGo] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);

  // 교통편 데이터 요청/조회 함수 (조합별 캐싱)
  const fetchAndCacheTransport = async (params, mode) => {
    const key = JSON.stringify(params);
    if (transportCache[key]) {
      setCurrentTransportData(transportCache[key]);
      return transportCache[key];
    }
    if (mode === "go") setLoadingGo(true);
    else setLoadingReturn(true);
    setCurrentTransportData(null); // 반드시 loading true 이후에 초기화
    const data = await getTransportInfo(params);
    setTransportCache(prev => ({ ...prev, [key]: data }));
    setCurrentTransportData(data);
    if (mode === "go") setLoadingGo(false);
    else setLoadingReturn(false);
    return data;
  };

  // 모달 열기 전 데이터 준비 함수
  const openTransportModal = async (mode) => {
    if (!selectedDateRange || !selectedTimes) return;
    const date = mode === "go" ? selectedDateRange.startDate : selectedDateRange.endDate;
    const time = mode === "go" ? selectedTimes.startDepart : selectedTimes.endDepart;
    const departure = mode === "go" ? "서울" : "부산";
    const arrival = mode === "go" ? "부산" : "서울";
    const params = {
      departure,
      arrival,
      date: `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`,
      departureTime: time
    };
    if (mode === "go") setLoadingGo(true);
    else setLoadingReturn(true);
    setCurrentTransportData(null);
    setShowTransportModal({ visible: true, mode });
    await fetchAndCacheTransport(params, mode);
  };

  // 시간 선택 후 교통편 모달 열기
  useEffect(() => {
    if (selectedTimes && currentStep === 2) {
      const openTransportModalAfterTimeSelect = async () => {
        await openTransportModal("go");
        setCurrentStep(3);
      };
      openTransportModalAfterTimeSelect();
    }
  }, [selectedTimes, currentStep]);

  // 날짜 선택 완료 핸들러
  const handleDateSelect = (dateRange) => {
    console.log("날짜 선택 완료:", dateRange);
    setSelectedDateRange(dateRange);
    setShowDateModal(false);
    setShowTimeModal(true);
    setCurrentStep(2);
    // 날짜 바뀌면 이전 교통편 데이터/선택 초기화
    setTransportCache({});
    setCurrentTransportData(null);
    setSelectedGoTransport(null);
    setSelectedReturnTransport(null);
  };

  // 시간 선택 완료 핸들러
  const handleTimeSelect = (times) => {
    console.log("시간 선택 완료:", times);
    setSelectedTimes(times);
    setShowTimeModal(false);
  };

  // 가는날 교통편 선택 완료 핸들러 (다음)
  const handleTransportNext = async (goTransport) => {
    setSelectedGoTransport(goTransport);
    setShowTransportModal({ visible: false, mode: "go" }); // 가는날 모달 닫기
    setTimeout(() => {
      setShowTransportModal({ visible: true, mode: "return" }); // 오는날 모달 열기
      openTransportModal("return").then(() => {
        setCurrentStep(4);
      });
    }, 0);
  };

  // 오는날 교통편 선택 완료 핸들러 (완료)
  const handleTransportSelect = (returnTransport) => {
    setSelectedReturnTransport(returnTransport);
    setShowTransportModal({ visible: false, mode: "return" });
    navigate("/planner", {
      state: {
        departure: "서울",
        arrival: "부산",
        date: selectedDateRange.startDate,
        goTransport: selectedGoTransport,
        returnTransport: returnTransport
      }
    });
  };

  // 이전 단계로 돌아가기
  const handleBack = async () => {
    if (currentStep === 4) {
      setShowTransportModal({ visible: false, mode: "return" });
      setTimeout(() => {
        setShowTransportModal({ visible: true, mode: "go" });
        openTransportModal("go").then(() => {
          setCurrentStep(3);
        });
      }, 0);
    } else if (currentStep === 3) {
      setShowTransportModal({ visible: false, mode: "go" });
      setShowTimeModal(true);
      setCurrentStep(2);
    } else if (currentStep === 2) {
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
      {showTransportModal.visible && selectedTimes && selectedDateRange && (
        <TransportSelectModal
          date={showTransportModal.mode === "go" ? selectedDateRange.startDate : selectedDateRange.endDate}
          time={showTransportModal.mode === "go" ? selectedTimes.startDepart : selectedTimes.endDepart}
          mode={showTransportModal.mode}
          onSelect={handleTransportSelect}
          onNext={showTransportModal.mode === "go" ? handleTransportNext : undefined}
          onClose={() => setShowTransportModal({ visible: false, mode: showTransportModal.mode })}
          onBack={currentStep === 4 ? handleBack : undefined}
          transportData={currentTransportData}
          loading={showTransportModal.mode === "go" ? loadingGo : loadingReturn}
        />
      )}
    </PageWrapper>
  );
};

export default StartPlannerPage;
