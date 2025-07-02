import React, { useEffect, useState } from "react";
import { fetchStationsByCity } from "../api/station";

const StationSelector = ({ city, selectedStation, setSelectedStation }) => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    if (!city) {
      setStations([]);
      return;
    }
    const fetchData = async () => {
      try {
        const data = await fetchStationsByCity(city);
        setStations(data);
      } catch (err) {
        console.error("역 목록 불러오기 실패:", err);
      }
    };
    fetchData();
  }, [city]);

  return (
    <select
      value={selectedStation}
      onChange={(e) => setSelectedStation(e.target.value)}
    >
      <option value="">역 선택</option>
      {stations.map((station) => (
        <option key={station.stationCode} value={station.stationCode}>
          {station.stationName}
        </option>
      ))}
    </select>
  );
};

export default StationSelector;
