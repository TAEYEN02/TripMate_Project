import React, { useEffect, useState } from 'react';
import api from '../api/index';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import styled from 'styled-components'; // styled-components 추가
import dayjs from 'dayjs'; // dayjs 추가

const SharedTripsContainer = styled.div`
    max-width: 1200px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
    font-size: 2.5rem;
    color: #343a40;
    text-align: center;
    margin-bottom: 2rem;
`;

const ScheduleGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
`;

const ScheduleCard = styled.div`
    background-color: #fff;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
`;

const ScheduleTitle = styled.h2`
    font-size: 1.5rem;
    color: #007bff;
    margin-top: 0;
    margin-bottom: 0.75rem;
`;

const ScheduleMeta = styled.p`
    font-size: 0.9rem;
    color: #6c757d;
    margin-bottom: 0.5rem;
`;

const ScheduleDescription = styled.p`
    font-size: 1rem;
    color: #495057;
    margin-bottom: 1rem;
    line-height: 1.5;
`;

const SchedulePlaces = styled.div`
    font-size: 0.9rem;
    color: #495057;
    margin-top: 1rem;
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    li {
        margin-bottom: 0.25rem;
    }
`;

const ScheduleUser = styled.p`
    font-size: 0.85rem;
    color: #868e96;
    text-align: right;
    margin-top: 1rem;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PhotoItem = styled.div`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

function SharedTripsPage() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        const fetchSharedSchedules = async () => {
            try {
                const response = await api.get('/schedule/shared');
                setSchedules(response.data);
            } catch (err) {
                setError('공유된 여행 계획을 불러오는데 실패했습니다.');
                console.error('공유된 여행 계획 불러오기 오류:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSharedSchedules();
    }, []);

    if (loading) {
        return <SharedTripsContainer>공유된 여행 계획을 로딩 중...</SharedTripsContainer>;
    }

    if (error) {
        return <SharedTripsContainer style={{ color: 'red' }}>{error}</SharedTripsContainer>;
    }

    return (
        <SharedTripsContainer>
            <Title>공유된 여행 계획</Title>
            {schedules.length === 0 ? (
                <p>아직 공유된 여행 계획이 없습니다.</p>
            ) : (
                <ScheduleGrid>
                    {schedules.map((schedule) => (
                        <ScheduleCard key={schedule.id} onClick={() => navigate(`/schedule/${schedule.id}`)}>
                            <ScheduleTitle>{schedule.title || '제목 없음'}</ScheduleTitle>
                            <ScheduleMeta>기간: {schedule.startDate ? dayjs(schedule.startDate).format('YYYY.MM.DD') : '날짜 정보 없음'} ~ {schedule.endDate ? dayjs(schedule.endDate).format('YYYY.MM.DD') : '날짜 정보 없음'}</ScheduleMeta>
                            <ScheduleDescription>{schedule.description || '설명 없음'}</ScheduleDescription>
                            {schedule.places && schedule.places.length > 0 && (
                                <SchedulePlaces>
                                    <h4>주요 장소:</h4>
                                    <ul>
                                        {schedule.places.slice(0, 3).map((place, index) => (
                                            <li key={index}>{place.name}</li>
                                        ))}
                                        {schedule.places.length > 3 && <li>...</li>}
                                    </ul>
                                </SchedulePlaces>
                            )}
                            {schedule.photos && schedule.photos.length > 0 && (
                                <PhotoGrid>
                                    {schedule.photos.map((photo) => (
                                        <PhotoItem key={photo.id}>
                                            <img src={`http://localhost:10000${photo.imageUrl}`} alt="Schedule Photo" onError={e => e.target.src = '/icons/tourist.png'} />
                                        </PhotoItem>
                                    ))}
                                </PhotoGrid>
                            )}
                            <ScheduleUser>
                                공유자: {(schedule.user && schedule.user.username) ? schedule.user.username : (schedule.username || '알 수 없음')}
                            </ScheduleUser>
                        </ScheduleCard>
                    ))}
                </ScheduleGrid>
            )}
        </SharedTripsContainer>
    );
}

export default SharedTripsPage;
