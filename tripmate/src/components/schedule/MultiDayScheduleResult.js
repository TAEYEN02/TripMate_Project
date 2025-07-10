import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 1rem;
`;

const DateTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${(props) => (props.active ? "#4a90e2" : "#eee")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const CardList = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding-bottom: 8px;
`;

const Card = styled.div`
  flex: 0 0 250px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const PlaceImage = styled.img`
  width: 100%;
  height: 140px;
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 0.75rem;
  background: #eee;
`;

const PlaceName = styled.strong`
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
  color: #222;
`;

const Category = styled.span`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 0.5rem;
`;

const Address = styled.p`
  font-size: 0.85rem;
  color: #555;
  margin-top: auto;
`;

const NoData = styled.li`
  color: #999;
  font-style: italic;
  padding: 1rem;
`;

const MultiDayScheduleResult = ({ schedule, selectedDate, setSelectedDate, onPlaceClick }) => {
  const places = schedule.dailyPlan[selectedDate] || [];

  return (
    <Container>
      <DateTabs>
        {Object.keys(schedule.dailyPlan).map((date) => (
          <TabButton
            key={date}
            active={date === selectedDate}
            onClick={() => setSelectedDate(date)}
          >
            {date}
          </TabButton>
        ))}
      </DateTabs>

      {places.length > 0 ? (
        <CardList>
          {places.map((place) => (
            <Card 
              key={place.name} 
              onClick={() => onPlaceClick(place)}  // 클릭 시 부모에 알림
              style={{ cursor: "pointer" }}
            >
              <PlaceImage
                src={place.photoUrl || "https://via.placeholder.com/250x140?text=No+Image"}
                alt={place.name}
                onError={e => e.target.src = '/icons/tourist.png'}
              />
              <PlaceName>{place.name}</PlaceName>
              <Category>{place.category}</Category>
              <Address>주소: {place.address}</Address>
            </Card>
          ))}
        </CardList>
      ) : (
        <ul>
          <NoData>추천 일정이 없습니다.</NoData>
        </ul>
      )}
    </Container>
  );
};

export default MultiDayScheduleResult;
