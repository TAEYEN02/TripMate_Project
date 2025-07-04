import { useState } from "react";
import styled from "styled-components";
import ScheduleForm from "../components/planner/PlaceRecomendForm";
import ScheduleResult from "../components/planner/ScheduleResult";
import { generateSchedule } from "../api/scheduleApi";
import MapComponent from "../components/map/MapComponent";

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  min-height: 600px;
  margin: 0 auto;
  padding: 2rem 2rem 3rem 2rem;
  background: #f9faff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2.1rem;
  font-weight: 700;
  color: #222;
  display: flex;
  align-items: center;
  gap: 0.7rem;
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

const TopRow = styled.div`
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
  width: 100%;
  justify-content: center;
`;

const FormBox = styled.div`
  flex: 1;
  min-width: 280px;
`;

const MapBox = styled.div`
  flex: 1;
  min-width: 300px;
  height: 410px;
`;

const ResultBox = styled.div`
  margin-top: 2.5rem;
  width: 100%;
`;

const Message = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: ${(props) => (props.error ? "red" : "#555")};
  font-weight: ${(props) => (props.error ? "700" : "400")};
`;

const PlannerPage = ({ defaultDeparture = "서울", defaultArrival = "부산" }) => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState(null); // 선택된 장소 ID 상태
  const [filteredPlaces, setFilteredPlaces] = useState([]);

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

  const handlePlaceClick = (placeId) => {
    setSelectedPlaceId(placeId);
  };

  return (
    <Container>
      <TitleRow>
        <Title>🌏 여행 일정지 추천</Title>
        <AddScheduleButton onClick={handleAddScheduleClick}>
          일정 추가하기
        </AddScheduleButton>
      </TitleRow>
      <TopRow>
        <FormBox>
          <ScheduleForm onSubmit={handleGenerate} defaultDeparture={defaultDeparture} defaultArrival={defaultArrival} />
        </FormBox>
        <MapBox>
          <MapComponent
            places={filteredPlaces}
            selectedPlaceId={selectedPlaceId}
            setSelectedPlaceId={setSelectedPlaceId}
          />
        </MapBox>
      </TopRow>
      <ResultBox>
        {loading && <Message>⏳ 일정을 생성 중입니다...</Message>}
        {error && <Message error>{error}</Message>}
        {schedule && (
          <ScheduleResult
            schedule={schedule}
            onPlaceClick={setSelectedPlaceId}
            selectedPlaceId={selectedPlaceId}
            onFilteredPlacesChange={setFilteredPlaces}
          />
        )}
      </ResultBox>
    </Container>
  );
};

export default PlannerPage;
