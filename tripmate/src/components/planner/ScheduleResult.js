import { useEffect, useState, useMemo, useRef } from "react";
import styled from "styled-components";

const CategoryFilter = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
`;
const FilterButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background-color: ${({ active }) => (active ? "#4caf50" : "#e0e0e0")};
  color: ${({ active }) => (active ? "white" : "#333")};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #81c784;
    color: white;
  }
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

const ScheduleResult = ({ schedule, onPlaceClick, selectedPlaceId, onFilteredPlacesChange }) => {
  const [mainCategory, setMainCategory] = useState("여행");
  const [subCategory, setSubCategory] = useState(null);

  // 1) 카테고리별로 분리 및 파싱
  const parsedPlaces = useMemo(() => {
    return (schedule?.places || []).map((place) => {
      const parts = place.category?.split(" > ") || ["기타"];
      return {
        ...place,
        mainCategory: parts[0],
        subCategory: parts[1] || null,
      };
    });
  }, [schedule]);

  // 2) 메인 카테고리 목록
  const mainCategories = useMemo(() => {
    return [...new Set(parsedPlaces.map(p => p.mainCategory))];
  }, [parsedPlaces]);

  // 3) 필터된 장소 목록 (메모이제이션)
  const filteredPlaces = useMemo(() => {
    return parsedPlaces.filter((p) =>
      p.mainCategory === mainCategory &&
      (subCategory ? p.subCategory === subCategory : true)
    );
  }, [parsedPlaces, mainCategory, subCategory]);

  // 4) 부모에 필터링된 장소 전달 (변경 시에만)
  const prevFilteredRef = useRef();
  useEffect(() => {
    if (onFilteredPlacesChange) {
      const prev = prevFilteredRef.current;
      if (JSON.stringify(prev) !== JSON.stringify(filteredPlaces)) {
        onFilteredPlacesChange(filteredPlaces);
        prevFilteredRef.current = filteredPlaces;
      }
    }
  }, [filteredPlaces, onFilteredPlacesChange]);

  if (!schedule || !schedule.places) return null;

  return (
    <div>
      <CategoryFilter>
        {mainCategories.map((mainCat) => (
          <FilterButton
            key={mainCat}
            active={mainCat === mainCategory}
            onClick={() => {
              setMainCategory(mainCat);
              setSubCategory(null);
            }}
          >
            {mainCat}
          </FilterButton>
        ))}
      </CategoryFilter>

      {/* 서브 카테고리 버튼도 추가 가능 */}
      {/* ... */}

      <PlaceList>
        {filteredPlaces.map((p) => (
          <PlaceItem
            key={p.id}
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
    </div>
  );
};

export default ScheduleResult;
