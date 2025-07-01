import React, { useState } from "react";
import styled from "styled-components";
import ScheduleForm from "../componets/schedule/ScheduleForm";
import MultiDayScheduleResult from "../componets/schedule/MultiDayScheduleResult";
import MapComponent from "../componets/map/ScheduleMapComponent";
import { generateMultiDaySchedule } from "../api/scheduleApi";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 1rem 2rem;
  background: #f9faff;
  display: flex;
  box-sizing: border-box;
`;

const LeftPane = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
`;

const RightPane = styled.div`
  flex: 1;
  height: 100%;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #222;
`;

const Message = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: ${(props) => (props.error ? "red" : "#555")};
  font-weight: ${(props) => (props.error ? "700" : "400")};
`;

const SchedulePage = () => {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleGenerate = async (formData) => {
        setLoading(true);
        setError("");
        setSchedule(null);
        setSelectedPlace(null);
        setSelectedDate(null);

        try {
            const res = await generateMultiDaySchedule(formData);
            setSchedule(res.data);

            // 일정 생성 후 첫 날짜 자동 선택
            const dates = Object.keys(res.data.dailyPlan);
            if (dates.length > 0) setSelectedDate(dates[0]);
        } catch (err) {
            setError("일정 생성 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <LeftPane>
                <Title>여행 일정 추천</Title>
                <ScheduleForm onSubmit={handleGenerate} />
                {loading && <Message>⏳ 일정을 생성 중입니다...</Message>}
                {error && <Message error>{error}</Message>}

                {schedule && (
                    <>
                        <MultiDayScheduleResult
                            schedule={schedule}
                            selectedDate={selectedDate}
                            setSelectedDate={(date) => {
                                setSelectedDate(date);
                                setSelectedPlace(null);
                            }}
                            onPlaceClick={(place) => setSelectedPlace(place)}
                        />
                        <button
                            onClick={() => {
                                localStorage.setItem("mySchedule", JSON.stringify(schedule));
                                window.location.href = "/my-schedule";
                            }}
                            style={{
                                marginTop: "1rem",
                                padding: "0.5rem 1rem",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            내 일정에 추가하기
                        </button>
                    </>
                )}
            </LeftPane>
            <RightPane>
                <MapComponent
                    dailyPlan={schedule?.dailyPlan || {}}
                    selectedDate={selectedDate}
                    selectedPlace={selectedPlace}
                    onCloseInfo={() => setSelectedPlace(null)}
                />
            </RightPane>
        </Container>
    );
};

export default SchedulePage;
