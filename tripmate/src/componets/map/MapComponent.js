import React, { useState, useEffect } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import styled from "styled-components";

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
`;

const InfoWindowContent = styled.div`
  padding: 10px;
  max-width: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.2);
  font-size: 0.9rem;
`;

const PlaceImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 6px;
`;

const MapComponent = ({ places, selectedPlaceId }) => {
  // 기본 중심 좌표: 첫 장소 or 서울 중심
  const center = places.length
    ? { lat: places[0].latitude, lng: places[0].longitude }
    : { lat: 37.5665, lng: 126.9780 };

  const [infoPosition, setInfoPosition] = useState(null);
  const [infoData, setInfoData] = useState(null);

  // selectedPlaceId가 바뀌면 위치 및 데이터 설정
  useEffect(() => {
    if (!selectedPlaceId) {
      setInfoPosition(null);
      setInfoData(null);
      return;
    }
    const place = places.find((p) => p.id === selectedPlaceId);
    if (place) {
      setInfoPosition({ lat: place.latitude, lng: place.longitude });
      setInfoData(place);
    }
  }, [selectedPlaceId, places]);

  return (
    <MapWrapper>
      <Map
        center={center}
        style={{ width: "100%", height: "100%" }}
        level={5}
      >
        {places.map((place) => (
          <MapMarker
            key={place.id}
            position={{ lat: place.latitude, lng: place.longitude }}
            image={{
              src: selectedPlaceId === place.id
                ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png"
                : "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png",
              size: { width: 24, height: 35 },
              options: { offset: { x: 12, y: 35 } },
            }}
            clickable={true}
            onClick={() => {
              // 마커 클릭시 선택된 장소 변경 (필요시)
              // 여기에 setSelectedPlaceId가 필요하면 상위 컴포넌트 콜백을 전달해야 함
            }}
          />
        ))}

        {/* 선택된 장소에만 말풍선 띄우기 */}
        {infoPosition && infoData && (
          <CustomOverlayMap position={infoPosition}>
            <InfoWindowContent>
              <PlaceImage
                src={infoData.photoUrl || "https://via.placeholder.com/200x100?text=No+Image"}
                alt={infoData.name}
              />
              <strong>{infoData.name}</strong>
              <br />
              <small>{infoData.address}</small>
            </InfoWindowContent>
          </CustomOverlayMap>
        )}
      </Map>
    </MapWrapper>
  );
};

export default MapComponent;
