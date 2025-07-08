import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

import MapComponent from '../components/map/ScheduleMapComponent';
import PlaceSearchBar from '../components/schedule/PlaceSearchBar';
import ReviewForm from '../components/ReviewForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaArrowDown } from 'react-icons/fa';
import { Button } from '../components/common/StyledComponents';

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

const DateSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const DateButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: ${(props) => (props.$active ? '#007bff' : '#fff')};
  color: ${(props) => (props.$active ? '#fff' : '#333')};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${(props) => (props.$active ? '#0056b3' : '#eaeaea')};
  }
`;

const MapWrapper = styled.div`
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ScheduleList = styled.div`
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

const Item = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
`;

const DeleteButton = styled.button`
  background-color: #ff6b6b;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #ff4c4c;
  }
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

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
`;

const PhotoItem = styled.div`
  width: 100%;
  height: 100px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

function ScheduleDetailFull() {
  const { id } = useParams();
  const { getAuthHeaders, user } = useAuth();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoError, setPhotoError] = useState(null);

  // dailyPlan: { 날짜: [장소 리스트] } 형태로 변환
  const getDailyPlan = () => {
    if (!schedule || !schedule.places) return {};
    // schedule.places가 JSON 문자열로 되어있으면 파싱
    let placesArray = [];
    try {
      placesArray = typeof schedule.places === 'string' ? JSON.parse(schedule.places) : schedule.places;
    } catch {
      placesArray = [];
    }
    // 예를 들어 placesArray 내 각 장소에 date 필드가 있다고 가정. 없으면 기본 날짜 하나로 묶기
    if (placesArray.length > 0 && placesArray[0].date) {
      // 날짜별로 그룹화
      return placesArray.reduce((acc, place) => {
        if (!acc[place.date]) acc[place.date] = [];
        acc[place.date].push(place);
        return acc;
      }, {});
    } else {
      // 날짜 정보 없으면 전체를 하나의 날짜에 묶기
      return { [schedule.date]: placesArray };
    }
  };

  const dailyPlan = getDailyPlan();

  const travelDates = Object.keys(dailyPlan);
  useEffect(() => {
    if (travelDates.length > 0) {
      setSelectedDate(travelDates[0]);
    }
  }, [schedule]); // schedule이 바뀌면 날짜 초기화

  // 데이터 fetching
  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const res = await api.get(`/schedule/${id}`, { headers });
      setSchedule(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('스케줄 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id, getAuthHeaders]);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await api.get(`/reviews/schedule/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoadingPhotos(true);
      const res = await api.get(`/photos/schedule/${id}`);
      setPhotos(res.data);
      setPhotoError(null);
    } catch (err) {
      console.error(err);
      setPhotoError('사진을 불러오는데 실패했습니다.');
    } finally {
      setLoadingPhotos(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSchedule();
    fetchReviews();
    fetchPhotos();
  }, [fetchSchedule, fetchReviews, fetchPhotos]);

  // 일정 드래그앤드롭
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const updated = { ...schedule };
    const srcItems = Array.from(dailyPlan[source.droppableId]);
    const [moved] = srcItems.splice(source.index, 1);

    // 출발지 리스트 업데이트
    updated.places = Object.entries(dailyPlan).flatMap(([date, places]) =>
      date === source.droppableId ? srcItems : places
    );

    // 도착지 리스트 업데이트
    const destItems = Array.from(dailyPlan[destination.droppableId] || []);
    destItems.splice(destination.index, 0, moved);

    updated.places = Object.entries(dailyPlan).flatMap(([date, places]) =>
      date === destination.droppableId ? destItems : places
    );

    // 이부분은 실제 API PUT/PATCH 요청을 통해 서버에 업데이트 필요
    // 여기서는 일단 로컬에서만 업데이트
    setSchedule(updated);
  };
  // 로그인한 사용자와 일정 작성자 동일
  const isOwner = user && schedule && schedule.user && (
  user.userId === schedule.user.userId ||
  user.id === schedule.user.id
);


  console.log('user:', user);
  console.log('schedule.user:', schedule?.user);
  console.log('isOwner:', isOwner);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      alert('업로드할 파일을 선택해주세요.');
      return;
    }
    setLoadingPhotos(true);
    setPhotoError(null);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const headers = getAuthHeaders();
      await api.post(`/photos/upload/${id}`, formData, { headers });
      alert('사진이 성공적으로 업로드되었습니다!');
      setSelectedFile(null);
      fetchPhotos();
    } catch (err) {
      console.error(err);
      setPhotoError('사진 업로드 중 오류가 발생했습니다.');
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleReviewSubmitted = () => fetchReviews();

  return (
    <Container>
      <LeftSide>
        {/* 날짜 선택 */}
        <DateSelector>
          {travelDates.map(date => (
            <DateButton
              key={date}
              $active={selectedDate === date}
              onClick={() => setSelectedDate(date)}
            >
              {date}
            </DateButton>
          ))}
        </DateSelector>

        {/* 지도 */}
        <MapWrapper>
          <MapComponent
            dailyPlan={dailyPlan}
            selectedDate={selectedDate}
          />
        </MapWrapper>

        {/* 일정 리스트 (드래그앤드롭) */}
        {selectedDate && dailyPlan[selectedDate] && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={selectedDate}>
              {(provided) => (
                <ScheduleList
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {dailyPlan[selectedDate].map((place, idx) => (
                    <Draggable
                      key={`${selectedDate}-${idx}`}
                      draggableId={`${selectedDate}-${idx}`}
                      index={idx}
                    >
                      {(provided) => (
                        <Item
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div>{place.name}</div>
                          {/* 삭제 버튼은 소유자만 보여주기 */}
                          {isOwner && (
                            <DeleteButton
                              onClick={() => {
                                // 삭제 로직 (로컬 상태 + 서버 API 필요)
                                alert('삭제 기능 구현 필요');
                              }}
                            >
                              삭제
                            </DeleteButton>
                          )}
                        </Item>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ScheduleList>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </LeftSide>

      <RightSide>
        <DetailSection>
          <Title>{schedule?.title || '제목 없음'}</Title>
          <p><strong>작성자:</strong> {schedule?.user?.username || '알 수 없음'}</p>
          <p><strong>날짜:</strong> {schedule?.date}</p>
          <p><strong>출발지:</strong> {schedule?.departure}</p>
          <p><strong>도착지:</strong> {schedule?.arrival}</p>
          <p><strong>교통수단:</strong> {schedule?.transportType}</p>
          <p><strong>공개 여부:</strong> {schedule?.public ? '공개' : '비공개'}</p>

          {isOwner && (
            <Button
              style={{
                marginTop: '1rem',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
              }}
              onClick={() => navigate(`/my-schedule/${id}`)}
            >
              수정하기
            </Button>
          )}
        </DetailSection>

        <DetailSection>
          <h3>사진 관리</h3>
          {isOwner && (
            <>
              <input type="file" onChange={handleFileChange} />
              <button onClick={handlePhotoUpload} disabled={loadingPhotos || !selectedFile}>
                {loadingPhotos ? '업로드 중...' : '사진 업로드'}
              </button>
              {photoError && <p style={{ color: 'red' }}>{photoError}</p>}
            </>
          )}
          {photos.length === 0 ? (
            <p>아직 업로드된 사진이 없습니다.</p>
          ) : (
            <PhotoGrid>
              {photos.map(photo => (
                <PhotoItem key={photo.id}>
                  <img src={`http://localhost:10000${photo.imageUrl}`} alt="Schedule" />
                </PhotoItem>
              ))}
            </PhotoGrid>
          )}
        </DetailSection>

        <DetailSection>
          <h3>리뷰</h3>
          {reviews.length === 0 && <p>아직 작성된 리뷰가 없습니다.</p>}
          {reviews.map(review => (
            <div key={review.id} style={{ marginBottom: 8, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
              <strong>{review.title}</strong> ({review.rating}점)
              <p>{review.content}</p>
              <small>작성자: {review.user?.username || '알 수 없음'}</small>
            </div>
          ))}

          {/* 리뷰 작성 폼: 로그인 & 공개 & 작성자 아님 */}
          {user && schedule?.public && isOwner === false && (
            <ReviewForm scheduleId={id} onReviewSubmitted={handleReviewSubmitted} />
          )}
        </DetailSection>
      </RightSide>
    </Container>
  );
}

export default ScheduleDetailFull;
