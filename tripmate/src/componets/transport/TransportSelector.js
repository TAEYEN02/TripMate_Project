import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  fetchCityStationMap, // 기차
  fetchBusTerminalMap, // 버스
} from "../../api/station";

const timeRanges = [
  { value: "", label: "전체" },
  { value: "morning", label: "아침 (05:00~11:59)" },
  { value: "afternoon", label: "오후 (12:00~17:59)" },
  { value: "evening", label: "저녁 (18:00~22:59)" },
];

const transportTypes = [
  { value: "train", label: "기차" },
  { value: "bus", label: "버스" },
];

const Wrapper = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
`;
const Label = styled.label`
  display: block;
  margin-top: 1rem;
  font-weight: 600;
`;
const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;
const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;
const Button = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  background-color: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #38a169;
  }
`;

const TransportSelector = ({ onSubmit }) => {
  const [transportType, setTransportType] = useState("train");
  const [cityMap, setCityMap] = useState({});
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureStation, setDepartureStation] = useState("");
  const [arrivalStation, setArrivalStation] = useState("");
  const [date, setDate] = useState("");
  const [timeRange, setTimeRange] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      const res =
        transportType === "train"
          ? await fetchCityStationMap()
          : await fetchBusTerminalMap();
      setCityMap(res);
    };
    fetchStations();
  }, [transportType]);

  useEffect(() => setDepartureStation(""), [departureCity]);
  useEffect(() => setArrivalStation(""), [arrivalCity]);

  const handleSubmit = () => {
    if (!departureCity || !arrivalCity || !departureStation || !arrivalStation || !date) {
      alert("모든 항목을 선택해주세요.");
      return;
    }
    onSubmit({
      transportType,
      departure: departureStation,
      arrival: arrivalStation,
      date,
      timeRange,
    });
  };

  return (
    <Wrapper>
      <Label>교통 수단 선택</Label>
      <Select value={transportType} onChange={(e) => setTransportType(e.target.value)}>
        {transportTypes.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </Select>

      <Label>출발 도시</Label>
      <Select value={departureCity} onChange={(e) => setDepartureCity(e.target.value)}>
        <option value="">도시 선택</option>
        {Object.keys(cityMap).map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </Select>

      {departureCity && (
        <>
          <Label>출발 역/터미널</Label>
          <Select value={departureStation} onChange={(e) => setDepartureStation(e.target.value)}>
            <option value="">선택</option>
            {cityMap[departureCity]?.map((s) => (
              <option key={s.code || s.terminalCode} value={s.code || s.terminalCode}>
                {s.name || s.terminalName}
              </option>
            ))}
          </Select>
        </>
      )}

      <Label>도착 도시</Label>
      <Select value={arrivalCity} onChange={(e) => setArrivalCity(e.target.value)}>
        <option value="">도시 선택</option>
        {Object.keys(cityMap).map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </Select>

      {arrivalCity && (
        <>
          <Label>도착 역/터미널</Label>
          <Select value={arrivalStation} onChange={(e) => setArrivalStation(e.target.value)}>
            <option value="">선택</option>
            {cityMap[arrivalCity]?.map((s) => (
              <option key={s.code || s.terminalCode} value={s.code || s.terminalCode}>
                {s.name || s.terminalName}
              </option>
            ))}
          </Select>
        </>
      )}

      <Label>출발 날짜</Label>
      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <Label>시간대</Label>
      <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
        {timeRanges.map((range) => (
          <option key={range.value} value={range.value}>{range.label}</option>
        ))}
      </Select>

      <Button onClick={handleSubmit}>조회하기</Button>
    </Wrapper>
  );
};

export default TransportSelector;