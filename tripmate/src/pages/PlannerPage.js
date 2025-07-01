// PlannerPage.jsx (일부 수정)

import React, { useState } from "react";
import styled from "styled-components";
import ScheduleForm from "../componets/planner/PlaceRecomendForm";
import ScheduleResult from "../componets/planner/ScheduleResult";
import { generateSchedule } from "../api/scheduleApi";
import MapComponent from "../componets/map/MapComponent";

const Container = styled.div`
  height: 850px;
  width: 100%;
  margin: 3px auto;
  padding: 1px 2rem;
  background: #f9faff;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  gap: 2rem; 
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  color: #222;
`;

const AddScheduleButton = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3a9a38;
  }
`;

const Message = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: ${(props) => (props.error ? "red" : "#555")};
  font-weight: ${(props) => (props.error ? "700" : "400")};
`;

const LeftPane = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const RightPane = styled.div`
  flex: 1;
  height: 100%;
`;

const PlannerPage = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState(null); // 선택된 장소 ID 상태

  // 일정 추가하기 버튼 클릭 시, 일정 생성 폼으로 포커스 이동 등 원하는 동작 추가 가능
  const handleAddScheduleClick = () => {
    alert("일정 추가하기 버튼 클릭! 일정 생성 폼에서 새로운 여행지를 입력하세요.");
  };

  const handleGenerate = async (formData) => {
    setLoading(true);
    setError("");
    setSchedule(null);
    setSelectedPlaceId(null);

    try {
      const res = await generateSchedule(formData);
      setSchedule(res.data);
    } catch (err) {
      setError("일정 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  // ScheduleResult에서 장소 클릭 시 호출
  const handlePlaceClick = (placeId) => {
    setSelectedPlaceId(placeId);
  };

  return (
    <Container>
      <LeftPane>
        <TitleRow>
          <Title>🌏 여행 일정지 추천</Title>
          <AddScheduleButton onClick={handleAddScheduleClick}>
            일정 추가하기
          </AddScheduleButton>
        </TitleRow>

        <ScheduleForm onSubmit={handleGenerate} />

        {loading && <Message>⏳ 일정을 생성 중입니다...</Message>}
        {error && <Message error>{error}</Message>}

          {schedule && (
          <ScheduleResult
            schedule={schedule}
            onPlaceClick={handlePlaceClick}  // 클릭 이벤트 핸들러 전달
            selectedPlaceId={selectedPlaceId}
          />
        )}
      </LeftPane>
      <RightPane>
         <MapComponent
          places={schedule?.places || []}
          selectedPlaceId={selectedPlaceId}  // 선택된 장소 ID 전달
        />
      </RightPane>
    </Container>
  );
};

export default PlannerPage;
