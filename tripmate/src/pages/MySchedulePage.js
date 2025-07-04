import { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import MapComponent from "../components/map/ScheduleMapComponent";
import PlaceSearchBar from "../components/schedule/PlaceSearchBar";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import dayjs from "dayjs";
import SimpleModal from "../components/Modal/SimpleModal";
import SearchPage from "./SearchPage";
import SchedulePage from "./SchedulePage";

const PageContainer = styled.div`
  display: flex;
  height: 90vh;
  padding: 1rem;
`;

const LeftMap = styled.div`
  flex: 1;
  margin-right: 1rem;
`;

const RightList = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 12px;
`;

const DateSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const DateButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: ${(props) => (props.$active ? "#007bff" : "#fff")};
  color: ${(props) => (props.$active ? "#fff" : "#333")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.$active ? "#0056b3" : "#eaeaea")};
  }
`;

const NavigationButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #555;
  margin: 0 0.5rem;

  &:hover {
    color: #000;
  }
`;

const Item = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none; /* 드래그 중 텍스트 선택 방지 */
`;


const DeleteButton = styled.button`
  background-color: #ff6b6b;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff4c4c;
  }
`;

const TransportInfo = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const TransportTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-size: 1rem;
`;

const TransportDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const TransportLabel = styled.span`
  font-weight: 600;
  color: #6c757d;
`;

const TransportValue = styled.span`
  color: #495057;
`;

const MySchedulePage = () => {
    const location = useLocation();
    const [schedule, setSchedule] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [prevIndexMap, setPrevIndexMap] = useState({});
    const [transportInfo, setTransportInfo] = useState(null);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [openScheduleModal, setOpenScheduleModal] = useState(false);

    // 4자리 숫자(0630) → 06:30 변환 함수
    const formatTime = (str) => {
        if (!str || str.length !== 4) return str;
        return str.slice(0, 2) + ':' + str.slice(2, 4);
    };

    // 교통편 정보를 파싱하여 종류와 시간을 분리하는 함수
    const parseTransportInfo = (transportStr) => {
        if (!transportStr || typeof transportStr !== 'string') return { type: transportStr, time: '' };
        
        // "KTX | 서울역 → 부산역 | 0630 → 0930 | 59800원" 형태 파싱
        const parts = transportStr.split('|').map(part => part.trim());
        
        if (parts.length >= 3) {
            const type = parts[0]; // KTX, ITX, SRT, 버스 등
            const timeMatch = parts[2].match(/(\d{4})\s*→\s*(\d{4})/);
            
            if (timeMatch) {
                const depTime = formatTime(timeMatch[1]);
                const arrTime = formatTime(timeMatch[2]);
                return {
                    type: type,
                    time: `${depTime} - ${arrTime}`
                };
            }
        }
        
        return { type: transportStr, time: '' };
    };

    useEffect(() => {
        // 전달받은 교통편 정보가 있으면 저장
        if (location.state) {
            setTransportInfo(location.state);
        }

        const saved = localStorage.getItem("mySchedule");
        if (saved) {
            const parsed = JSON.parse(saved);
            setSchedule(parsed);
            const dates = Object.keys(parsed.dailyPlan);
            if (dates.length > 0) setSelectedDate(dates[0]);
        }
    }, [location.state]);

    const addCustomPlace = (place) => {
        if (!selectedDate || !place) return;
        const updated = { ...schedule };
        updated.dailyPlan[selectedDate] = [
            ...(updated.dailyPlan[selectedDate] || []),
            place,
        ];
        setSchedule(updated);
        localStorage.setItem("mySchedule", JSON.stringify(updated));
    };

    const deletePlace = (date, idx) => {
        const updated = { ...schedule };
        updated.dailyPlan[date] = updated.dailyPlan[date].filter((_, i) => i !== idx);
        setSchedule(updated);
        localStorage.setItem("mySchedule", JSON.stringify(updated));
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        const updated = { ...schedule };

        const sourceItems = Array.from(updated.dailyPlan[source.droppableId]);
        const [movedItem] = sourceItems.splice(source.index, 1);
        updated.dailyPlan[source.droppableId] = sourceItems;

        const destItems = Array.from(updated.dailyPlan[destination.droppableId] || []);
        destItems.splice(destination.index, 0, movedItem);
        updated.dailyPlan[destination.droppableId] = destItems;

        setSchedule(updated);
        localStorage.setItem("mySchedule", JSON.stringify(updated));
    };

    const moveDate = (direction) => {
        if (!schedule || !selectedDate) return;
        const dates = Object.keys(schedule.dailyPlan);
        const currentIndex = dates.indexOf(selectedDate);
        const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
        if (newIndex >= 0 && newIndex < dates.length) {
            setSelectedDate(dates[newIndex]);
            setSelectedPlace(null);
        }
    };

    // 여행 날짜 배열 생성 함수
    const getTravelDates = () => {
        if (transportInfo && transportInfo.date && transportInfo.days) {
            const start = dayjs(transportInfo.date);
            const arr = [];
            for (let i = 0; i < transportInfo.days; i++) {
                arr.push(start.add(i, "day").format("YYYY-MM-DD"));
            }
            return arr;
        }
        // fallback: 기존 dailyPlan의 key 사용
        if (schedule && schedule.dailyPlan) {
            return Object.keys(schedule.dailyPlan);
        }
        return [];
    };

    return (
        <PageContainer>
            <LeftMap>
                <PlaceSearchBar onPlaceSelect={addCustomPlace} />
                <MapComponent
                    dailyPlan={schedule?.dailyPlan || {}}
                    selectedDate={selectedDate}
                    selectedPlace={selectedPlace}
                    onCloseInfo={() => setSelectedPlace(null)}
                />
            </LeftMap>

            <RightList>
                <h2>내 일정</h2>

                {/* 교통편 정보 표시 */}
                {transportInfo && (
                    <TransportInfo>
                        <TransportTitle>🚄 교통편 정보</TransportTitle>
                        <TransportDetail>
                            <TransportLabel>출발지:</TransportLabel>
                            <TransportValue>{transportInfo.departure}</TransportValue>
                        </TransportDetail>
                        <TransportDetail>
                            <TransportLabel>도착지:</TransportLabel>
                            <TransportValue>{transportInfo.arrival}</TransportValue>
                        </TransportDetail>
                        <TransportDetail>
                            <TransportLabel>출발 날짜:</TransportLabel>
                            <TransportValue>{transportInfo.date.toLocaleDateString ? transportInfo.date.toLocaleDateString() : transportInfo.date}</TransportValue>
                        </TransportDetail>
                        {transportInfo.goTransport && (
                            <TransportDetail>
                                <TransportLabel>가는 교통편:</TransportLabel>
                                <TransportValue>{parseTransportInfo(transportInfo.goTransport).type} {parseTransportInfo(transportInfo.goTransport).time}</TransportValue>
                            </TransportDetail>
                        )}
                        {transportInfo.returnTransport && (
                            <TransportDetail>
                                <TransportLabel>오는 교통편:</TransportLabel>
                                <TransportValue>{parseTransportInfo(transportInfo.returnTransport).type} {parseTransportInfo(transportInfo.returnTransport).time}</TransportValue>
                            </TransportDetail>
                        )}
                    </TransportInfo>
                )}

                {/* 여행 날짜 선택 버튼 + 추천 버튼 */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                    <DateSelector>
                        <NavigationButton onClick={() => moveDate("prev")}>{"<"}</NavigationButton>
                        {getTravelDates().map((date) => (
                            <DateButton
                                key={date}
                                $active={selectedDate === date}
                                onClick={() => {
                                    setSelectedDate(date);
                                    setSelectedPlace(null);
                                }}
                            >
                                {date}
                            </DateButton>
                        ))}
                        <NavigationButton onClick={() => moveDate("next")}>{">"}</NavigationButton>
                    </DateSelector>
                    <button
                        style={{ marginLeft: 16, padding: "8px 16px", borderRadius: 8, background: "#2563eb", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}
                        onClick={() => setOpenSearchModal(true)}
                    >
                        여행지 추천
                    </button>
                    <button
                        style={{ marginLeft: 8, padding: "8px 16px", borderRadius: 8, background: "#10b981", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}
                        onClick={() => setOpenScheduleModal(true)}
                    >
                        스케줄 추천
                    </button>
                </div>

                {schedule && selectedDate && (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId={selectedDate} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {(schedule.dailyPlan[selectedDate] || []).map((p, idx) => {
                                        const id = `${selectedDate}-${idx}`;
                                        const prevIndex = prevIndexMap[id] ?? idx;
                                        const direction = idx > prevIndex ? "down" : idx < prevIndex ? "up" : "stay";

                                        return (
                                            <Draggable key={id} draggableId={id} index={idx}>
                                                {(provided) => (
                                                    <Item
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        initial={{ opacity: 0, y: direction === "down" ? 20 : direction === "up" ? -20 : 0 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        onMouseEnter={() => setSelectedPlace(p)}
                                                        onMouseLeave={() => setSelectedPlace(null)}
                                                    >
                                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                            {idx < (schedule.dailyPlan[selectedDate]?.length || 0) - 1 && (
                                                                <button
                                                                    style={{
                                                                        background: "none",
                                                                        border: "none",
                                                                        cursor: "pointer",
                                                                        color: "#007bff",
                                                                        fontSize: "1.2rem",
                                                                    }}
                                                                    title="다음 장소로 길찾기"
                                                                    onClick={() => {
                                                                        const from = schedule.dailyPlan[selectedDate][idx];
                                                                        const to = schedule.dailyPlan[selectedDate][idx + 1];

                                                                        if (!from || !to) {
                                                                            alert("출발지 또는 도착지 정보가 부족합니다.");
                                                                            return;
                                                                        }

                                                                        const url = `https://map.kakao.com/?target=car` +
                                                                            `&sX=${from.lng}&sY=${from.lat}` +
                                                                            `&eX=${to.lng}&eY=${to.lat}`;

                                                                        window.open(url, "_blank");
                                                                    }}
                                                                >
                                                                    <FaArrowDown />
                                                                </button>
                                                            )}

                                                            <div>
                                                                <span>{p.name}</span>
                                                                <p style={{ fontSize: "small", color: "gray" }}>{p.category}</p>
                                                            </div>
                                                        </div>

                                                        <DeleteButton onClick={() => deletePlace(selectedDate, idx)}>
                                                            삭제
                                                        </DeleteButton>
                                                    </Item>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
                {/* 모달 */}
                <SimpleModal open={openSearchModal} onClose={() => setOpenSearchModal(false)}>
                    <SearchPage />
                </SimpleModal>
                <SimpleModal open={openScheduleModal} onClose={() => setOpenScheduleModal(false)}>
                    <SchedulePage />
                </SimpleModal>
            </RightList>
        </PageContainer>
    );
};

export default MySchedulePage;