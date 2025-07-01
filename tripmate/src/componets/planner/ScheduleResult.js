import React from "react";
import styled from "styled-components";

const CategorySection = styled.div`
  margin-bottom: 1.5rem;
`;

const CategoryTitle = styled.h3`
  margin-bottom: 0.75rem;
  border-left: 6px solid #4caf50;
  padding-left: 10px;
  color: #2e7d32;
`;

const PlaceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PlaceItem = styled.li`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  padding: 10px 15px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border: ${(props) => (props.selected ? "2px solid #4caf50" : "none")};
  transition: border 0.2s ease;

  &:hover {
    background: #e8f5e9;
  }
`;

const PlaceName = styled.span`
  font-weight: 600;
  color: #333;
`;

const PlaceAddress = styled.span`
  font-size: 0.85rem;
  color: #666;
`;

const ScheduleResult = ({ schedule, onPlaceClick, selectedPlaceId }) => {
  if (!schedule || !schedule.places) return null;

  // 카테고리별 그룹화
  const grouped = schedule.places.reduce((acc, place) => {
    const cat = place.category || "기타";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(place);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([category, places]) => (
        <CategorySection key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          <PlaceList>
            {places.map((p) => (
              <PlaceItem
                key={p.id} // 반드시 고유 id 있어야 함
                onClick={() => onPlaceClick(p.id)}
                selected={selectedPlaceId === p.id}
                title={`${p.name}\n${p.address}`}
              >
                <div>
                  <PlaceName>{p.name}</PlaceName><br />
                  <PlaceAddress>{p.address}</PlaceAddress>
                </div>
              </PlaceItem>
            ))}
          </PlaceList>
        </CategorySection>
      ))}
    </div>
  );
};

export default ScheduleResult;
