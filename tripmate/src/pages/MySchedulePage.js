import { useEffect, useState } from "react";
import styled from "styled-components";
import MapComponent from "../components/map/ScheduleMapComponent";
import PlaceSearchBar from "../components/schedule/PlaceSearchBar";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";

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
  background-color: ${(props) => (props.active ? "#007bff" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#0056b3" : "#eaeaea")};
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

const MySchedulePage = () => {
    const [schedule, setSchedule] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [prevIndexMap, setPrevIndexMap] = useState({});

    useEffect(() => {
        const saved = localStorage.getItem("mySchedule");
        if (saved) {
            const parsed = JSON.parse(saved);
            setSchedule(parsed);
            const dates = Object.keys(parsed.dailyPlan);
            if (dates.length > 0) setSelectedDate(dates[0]);
        }
    }, []);

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

                {schedule && (
                    <DateSelector>
                        <NavigationButton onClick={() => moveDate("prev")}>{"<"}</NavigationButton>
                        {Object.keys(schedule.dailyPlan).map((date) => (
                            <DateButton
                                key={date}
                                active={selectedDate === date}
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
                )}

                {schedule && selectedDate && (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId={selectedDate}>
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

                                                                        console.log("from 객체:", from);
                                                                        console.log("from.name:", from?.name);
                                                                        console.log("from.lat:", from?.lat);
                                                                        console.log("from.lng:", from?.lng);

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
            </RightList>
        </PageContainer>
    );
};

export default MySchedulePage;