import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DateRangeModal from "../components/Modal/DateRangeModal";
import TimeSelectModal from "../components/Modal/TimeSelectModal";
import TransportSelectModal from "../components/Modal/TransportSelectModal";
import { getTransportInfo } from "../api/transportApi";
import dayjs from "dayjs";
import SimpleModal from "../components/common/SimpleModal";
import SearchPage from "./SearchPage";
import SchedulePage from "./SchedulePage";

// 스타일 정의
const PageWrapper = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2d3748;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #4a5568;
  text-align: center;
  margin-bottom: 3rem;
`;

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

  // 모달 상태
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState({ visible: false, mode: "go" });
  const [openSearchModal, setOpenSearchModal] = useState({ open: false, departure: "서울", arrival: "부산" });
  const [openScheduleModal, setOpenScheduleModal] = useState(false);

  // 선택값
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState(null);
  const [selectedGoTransport, setSelectedGoTransport] = useState(null);
  const [selectedReturnTransport, setSelectedReturnTransport] = useState(null);

  // 단계 상태
  const [currentStep, setCurrentStep] = useState(1);

  // 교통편 데이터 캐시 및 로딩
  const [transportCache, setTransportCache] = useState({});
  const [currentTransportData, setCurrentTransportData] = useState(null);
  const [loadingGo, setLoadingGo] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);

  // 날짜 선택 완료
  const handleDateSelect = (dateRange) => {
    setSelectedDateRange(dateRange);
    setShowDateModal(false);
    setShowTimeModal(true);
    setCurrentStep(2);
    setTransportCache({});
    setSelectedGoTransport(null);
    setSelectedReturnTransport(null);
  };

  // 시간 선택 완료
  const handleTimeSelect = (times) => {
    setSelectedTimes(times);
    setShowTimeModal(false);
  };

  // 교통편 데이터 가져오기 및 캐시
  const fetchAndCacheTransport = async (params, mode) => {
    const key = JSON.stringify(params);
    if (transportCache[key]) {
      setCurrentTransportData(transportCache[key]);
      return transportCache[key];
    }
    if (mode === "go") setLoadingGo(true);
    else setLoadingReturn(true);

    setCurrentTransportData(null);
    const data = await getTransportInfo(params);
    setTransportCache(prev => ({ ...prev, [key]: data }));
    setCurrentTransportData(data);

    if (mode === "go") setLoadingGo(false);
    else setLoadingReturn(false);
    return data;
  };

  // 교통편 모달 열기
  const openTransportModal = async (mode) => {
    const date = mode === "go" ? selectedDateRange.startDate : selectedDateRange.endDate;
    const time = mode === "go" ? selectedTimes.startDepart : selectedTimes.endDepart;
    const departure = mode === "go" ? "서울" : "부산";
    const arrival = mode === "go" ? "부산" : "서울";

    const params = {
      departure,
      arrival,
      date: `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`,
      departureTime: time
    };

    setShowTransportModal({ visible: true, mode });
    await fetchAndCacheTransport(params, mode);
  };

  // 시간 선택 후 자동으로 교통편(가는 날) 모달 열기
  useEffect(() => {
    if (selectedTimes && currentStep === 2) {
      const showGoModal = async () => {
        await openTransportModal("go");
        setCurrentStep(3);
      };
      showGoModal();
    }
  }, [selectedTimes, currentStep]);

  // 가는 날 선택 완료
  const handleTransportNext = (goTransport) => {
    setSelectedGoTransport(goTransport);
    setShowTransportModal({ visible: false, mode: "go" });

    setTimeout(() => {
      setShowTransportModal({ visible: true, mode: "return" });
      openTransportModal("return").then(() => setCurrentStep(4));
    }, 0);
  };

  // 오는 날 선택 완료
  const handleTransportSelect = (returnTransport) => {
    setSelectedReturnTransport(returnTransport);
    setShowTransportModal({ visible: false, mode: "return" });

    navigate("/my-schedule", {
      state: {
        departure: "서울",
        arrival: "부산",
        date: selectedDateRange.startDate,
        days: dayjs(selectedDateRange.endDate).diff(dayjs(selectedDateRange.startDate), "day") + 1, //여행기간(일수)
        goTransport: selectedGoTransport,
        returnTransport
      }
    });
  };

  // 뒤로 가기
  const handleBack = () => {
    if (currentStep === 4) {
      setShowTransportModal({ visible: false, mode: "return" });
      setTimeout(() => {
        setShowTransportModal({ visible: true, mode: "go" });
        openTransportModal("go").then(() => setCurrentStep(3));
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

  // 예시: 출발지/도착지 값을 받아서 모달을 염
  const handleOpenSearchModal = () => {
    // 실제로는 StartPlannerPage에서 선택된 값을 사용
    setOpenSearchModal({ open: true, departure: currentTransportData?.departure || "서울", arrival: currentTransportData?.arrival || "부산" });
  };

  // 예시: 출발지/도착지/날짜/박수 값을 받아서 모달을 염
  const handleOpenScheduleModal = () => {
    console.log("selectedDateRange:", selectedDateRange);
    if (!selectedDateRange?.startDate || !selectedDateRange?.endDate) {
      alert("여행 날짜를 먼저 선택해 주세요!");
      return;
    }
    const startDate = selectedDateRange.startDate;
    const endDate = selectedDateRange.endDate;
    const days = dayjs(endDate).diff(dayjs(startDate), "day") + 1;
    const departure = selectedGoTransport?.departure || currentTransportData?.departure || "서울";
    const arrival = selectedGoTransport?.arrival || currentTransportData?.arrival || "부산";
    const date = dayjs(startDate).format("YYYY-MM-DD");
    console.log("startDate:", startDate, "endDate:", endDate, "days:", days);
    console.log("departure:", departure, "arrival:", arrival, "date:", date, "days:", days);
    setOpenScheduleModal({
      open: true,
      date: date,
      days: days
    });
  };

  return (
    <PageWrapper>
      <Title>🚀 여행 계획 시작하기</Title>
      <Description>간단한 몇 단계를 거쳐 최적의 여행 일정을 만들어보세요!</Description>

      <StartButton onClick={() => setShowDateModal(true)}>여행 계획 시작하기</StartButton>

      {showDateModal && (
        <DateRangeModal onClose={() => setShowDateModal(false)} onSelect={handleDateSelect} />
      )}

      {showTimeModal && selectedDateRange && (
        <TimeSelectModal
          startDate={selectedDateRange.startDate}
          endDate={selectedDateRange.endDate}
          onClose={() => setShowTimeModal(false)}
          onSelect={handleTimeSelect}
        />
      )}

      {showTransportModal.visible && selectedTimes && selectedDateRange && (
        <TransportSelectModal
          date={
            showTransportModal.mode === "go"
              ? selectedDateRange.startDate
              : selectedDateRange.endDate
          }
          time={
            showTransportModal.mode === "go"
              ? selectedTimes.startDepart
              : selectedTimes.endDepart
          }
          mode={showTransportModal.mode}
          onSelect={handleTransportSelect}
          onNext={showTransportModal.mode === "go" ? handleTransportNext : undefined}
          onBack={currentStep === 4 ? handleBack : undefined}
          onClose={() => setShowTransportModal({ visible: false, mode: showTransportModal.mode })}
          transportData={currentTransportData}
          loading={showTransportModal.mode === "go" ? loadingGo : loadingReturn}
        />
      )}

      <SimpleModal open={openSearchModal.open} onClose={() => setOpenSearchModal({ ...openSearchModal, open: false })}>
        <SearchPage defaultDeparture={openSearchModal.departure} defaultArrival={openSearchModal.arrival} />
      </SimpleModal>

      <SimpleModal open={openScheduleModal.open} onClose={() => setOpenScheduleModal({ ...openScheduleModal, open: false })}>
        <SchedulePage
          defaultDeparture={selectedGoTransport?.departure || currentTransportData?.departure || "서울"}
          defaultArrival={selectedGoTransport?.arrival || currentTransportData?.arrival || "부산"}
          defaultDate={openScheduleModal.date}
          defaultDays={openScheduleModal.days}
        />
      </SimpleModal>
    </PageWrapper>
  );
};

export default StartPlannerPage;
