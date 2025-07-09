import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { updateSchedule } from '../api/UserApi';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import MapComponent from '../components/map/ScheduleMapComponent';
import ReviewForm from '../components/ReviewForm';
import PlaceSearchBar from '../components/schedule/PlaceSearchBar';
import { Button } from '../components/common/StyledComponents';

// --- Styled Components ---
const Container = styled.div`
  display: flex;
  height: 90vh;
  padding: 1rem;
  gap: 1rem;
`;

const LeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MapWrapper = styled.div`
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const RightSide = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailSection = styled.div`
  padding: 1rem;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
`;

const Title = styled.h1`
  margin-top: 0;
`;

const PlaceItem = styled.div`
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
  }
`;

const PlaceListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 0.5rem;
`;

const DayTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #eee;
`;

const DayTab = styled.button`
  padding: 0.75rem 1rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: ${props => (props.active ? '#007bff' : '#666')};
  border-bottom: ${props => (props.active ? '2px solid #007bff' : '2px solid transparent')};
  margin-bottom: -2px;
`;


// --- Edit Modal Component ---
const TRANSPORT_OPTIONS = ['KTX', 'Bus', 'Car', 'Airplane', 'Walk'];

function getDates(startDate, endDate) {
    const dates = [];
    let currentDate = dayjs(startDate);
    const lastDate = dayjs(endDate);
    while (currentDate.isBefore(lastDate) || currentDate.isSame(lastDate)) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        currentDate = currentDate.add(1, 'day');
    }
    return dates;
}



function ScheduleEditModal({ schedule, onClose, onSave }) {
  const [editableSchedule, setEditableSchedule] = useState(() => {
    const sanitizedPlaces = (schedule.places || []).map(place => ({
      ...place,
      date: place.date ? dayjs(place.date).format('YYYY-MM-DD') : dayjs(schedule.startDate).format('YYYY-MM-DD')
    }));
    return {
      ...schedule,
      startDate: schedule.startDate ? dayjs(schedule.startDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      endDate: schedule.endDate ? dayjs(schedule.endDate).format('YYYY-MM-DD') : dayjs(schedule.startDate).format('YYYY-MM-DD'),
      places: sanitizedPlaces
    };
  });

  const tripDates = useMemo(() => {
    return getDates(editableSchedule.startDate, editableSchedule.endDate);
  }, [editableSchedule.startDate, editableSchedule.endDate]);

  const [selectedDate, setSelectedDate] = useState(tripDates[0]);

  useEffect(() => {
    if (tripDates.length > 0 && !tripDates.includes(selectedDate)) {
      setSelectedDate(tripDates[0]);
    } else if (tripDates.length === 0) {
      setSelectedDate(null);
    }
  }, [tripDates]); // Removed selectedDate from dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableSchedule(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceAdd = (place) => {
    const newPlace = { ...place, date: selectedDate };
    const currentPlaces = editableSchedule.places || [];
    if (currentPlaces.find(p => p.name === newPlace.name && p.address === newPlace.address && p.date === newPlace.date)) {
      alert("이미 해당 날짜에 추가된 장소입니다.");
      return;
    }
    setEditableSchedule(prev => ({ ...prev, places: [...currentPlaces, newPlace] }));
  };

  const removePlace = (placeToRemove) => {
    const newPlaces = editableSchedule.places.filter(p => p !== placeToRemove);
    setEditableSchedule(prev => ({ ...prev, places: newPlaces }));
  };

  const handleSave = async () => {
    try {
      await onSave(editableSchedule);
      onClose();
    } catch (error) {
      alert('저장에 실패했습니다: ' + error.message);
      console.error('Save failed:', error);
    }
  };

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>일정 수정</h2>
        {/* General Info */}
        <FormGroup>
          <label>제목</label>
          <input name="title" value={editableSchedule.title || ''} onChange={handleChange} />
        </FormGroup>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <FormGroup style={{ flex: 1 }}>
                <label>여행 시작일</label>
                <input name="startDate" type="date" value={editableSchedule.startDate || ''} onChange={handleChange} />
            </FormGroup>
            <FormGroup style={{ flex: 1 }}>
                <label>여행 종료일</label>
                <input name="endDate" type="date" value={editableSchedule.endDate || ''} onChange={handleChange} />
            </FormGroup>
        </div>
        {/* Places by Day */}
        <hr style={{ margin: '1rem 0' }} />
        <h3>장소 관리</h3>
        <DayTabs>
            {tripDates.map((date, index) => (
                <DayTab key={date} active={selectedDate === date} onClick={() => setSelectedDate(date)}>
                    Day {index + 1}
                </DayTab>
            ))}
        </DayTabs>
        <PlaceSearchBar onPlaceSelect={handlePlaceAdd} />
        <div style={{ marginTop: '1rem' }}>
          {(editableSchedule.places || []).filter(p => p.date === selectedDate).map((place, index) => (
            <PlaceListItem key={`${place.name}-${place.address}-${place.date}-${index}`}>
              <span>{place.name} ({place.address})</span>
              <Button onClick={() => removePlace(place)} style={{ backgroundColor: '#ff6b6b' }}>삭제</Button>
            </PlaceListItem>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <Button onClick={onClose} style={{ backgroundColor: '#6c757d' }}>취소</Button>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </ModalContent>
    </ModalBackground>
  );
}

// --- Main Detail Component ---
function ScheduleDetailFull() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/schedule/${id}`);
      const rawData = res.data;
      const sanitizedSchedule = {
        ...rawData,
        startDate: rawData.startDate || dayjs().format('YYYY-MM-DD'),
        endDate: rawData.endDate || rawData.startDate || dayjs().format('YYYY-MM-DD'),
        places: rawData.places || [],
      };
      setSchedule(sanitizedSchedule);
      setError(null);

      const dailyPlanForMap = (sanitizedSchedule.places || []).reduce((acc, place) => {
        const date = place.date || sanitizedSchedule.startDate;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(place);
        return acc;
      }, {});
      const initialTripDates = Object.keys(dailyPlanForMap).sort();
      if (initialTripDates.length > 0) {
        setSelectedDay(initialTripDates[0]);
      }

    } catch (err) {
      setError('스케줄 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleUpdateSchedule = async (dataToSave) => {
    try {
      await updateSchedule(id, dataToSave);
      fetchSchedule();
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('스케줄 업데이트에 실패했습니다.');
    }
  };

  const isOwner = user && schedule && schedule.userId === user.userId;

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!schedule) return <p>스케줄을 찾을 수 없습니다.</p>;

  const dailyPlanForMap = (schedule.places || []).reduce((acc, place) => {
    const date = place.date || schedule.startDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(place);
    return acc;
  }, {});

  const tripDates = Object.keys(dailyPlanForMap).sort();

  return (
    <>
      <Container>
        <LeftSide>
          <MapWrapper>
            <MapComponent
              dailyPlan={dailyPlanForMap}
              selectedDate={selectedDay}
            />
          </MapWrapper>
        </LeftSide>
        <RightSide>
          <DetailSection>
            <Title>{schedule.title || '제목 없음'}</Title>
            <p><strong>작성자:</strong> {schedule.username || '알 수 없음'}</p>
            <p><strong>기간:</strong> {schedule.startDate} ~ {schedule.endDate}</p>
            {isOwner && (
              <Button onClick={() => setIsModalOpen(true)}>수정하기</Button>
            )}
          </DetailSection>

          <DayTabs>
            {tripDates.map((date, index) => (
              <DayTab key={date} active={selectedDay === date} onClick={() => setSelectedDay(date)}>
                Day {index + 1} ({date})
              </DayTab>
            ))}
          </DayTabs>

          {selectedDay && (
            <DetailSection>
              <h3>Day {tripDates.indexOf(selectedDay) + 1} ({selectedDay})</h3>
              {(dailyPlanForMap[selectedDay] && dailyPlanForMap[selectedDay].length > 0) ? (
                dailyPlanForMap[selectedDay].map((place, pIndex) => (
                  <PlaceItem key={pIndex}>
                    <strong>{pIndex + 1}. {place.name}</strong>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '4px 0 0 0' }}>{place.address}</p>
                  </PlaceItem>
                ))
              ) : (
                <p>등록된 장소가 없습니다.</p>
              )}
            </DetailSection>
          )}

          <DetailSection>
            <h3>리뷰</h3>
            <ReviewForm
              scheduleId={id}
              reviews={reviews}
              setReviews={setReviews}
            />
          </DetailSection>
        </RightSide>
      </Container>

      {isModalOpen && (
        <ScheduleEditModal
          schedule={schedule}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUpdateSchedule}
        />
      )}
    </>
  );
}

export default ScheduleDetailFull;