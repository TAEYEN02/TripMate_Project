import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import api from '../api/index';
import { fetchSchedules, fetchSharedSchedules, fetchUserProfile, shareSchedule } from '../api/UserApi';

// Styled Components (omitted for brevity, they are correct)
const MypageContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: #fff;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const UserInfo = styled.div`
  margin-bottom: 2rem;
  p {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
`;

const ScheduleItem = styled.div`
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #f8f9fa;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }

  p {
    font-size: 0.9rem;
    color: #6c757d;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`;

const WithdrawButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
  }

  input[type="text"]:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;
const ScheduleContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
`;

const ScheduleSection = styled.div`
  flex: 1;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fafafa;
`;


function Mypage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams();

  const [localUser, setLocalUser] = useState(null);
  const [mySchedules, setMySchedules] = useState([]);
  const [sharedSchedules, setSharedSchedules] = useState([]);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async (currentUser) => {
    if (!currentUser) return;
    try {
      const [schedules, shared] = await Promise.all([
        fetchSchedules(currentUser, paramUserId),
        fetchSharedSchedules(currentUser.userId)
      ]);
      setMySchedules(schedules);
      setSharedSchedules(shared);
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  }, [paramUserId]);

  const loadUserProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const profile = await fetchUserProfile(paramUserId, user);
      if (profile) {
        // Sanitize data before setting state to prevent null values in inputs
        const sanitizedProfile = {
          ...profile,
          username: profile.username || '',
          email: profile.email || '',
        };
        setLocalUser(sanitizedProfile);
        setEditUsername(sanitizedProfile.username);
        setEditEmail(sanitizedProfile.email);
        await fetchAllData(sanitizedProfile);
      } else {
        setError('사용자 정보를 찾을 수 없습니다.');
      }
    } catch (err) {
      setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [paramUserId, user, fetchAllData]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const isOwner = user && localUser && String(user.userId || user.id) === String(localUser.userId);

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  const handleWithdraw = async () => {
    if (!isOwner) return;
    if (window.confirm('정말로 회원 탈퇴를 하시겠습니까?')) {
      try {
        await api.delete('/auth/withdraw');
        logout();
        alert('회원 탈퇴가 완료되었습니다.');
        navigate('/');
      } catch (error) {
        alert('회원 탈퇴 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!isOwner) return;
    if (window.confirm('정말로 이 여행 계획을 삭제하시겠습니까?')) {
      try {
        await api.delete(`/schedule/${scheduleId}`);
        setMySchedules(mySchedules.filter(schedule => schedule.id !== scheduleId));
        alert('여행 계획이 삭제되었습니다.');
      } catch (error) {
        alert('여행 계획 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleShare = async (scheduleId) => {
    if (!isOwner) return;
    if (window.confirm('이 여행 계획을 다른 사용자들과 공유하시겠습니까?')) {
      try {
        await shareSchedule(scheduleId);
        alert('여행 계획이 성공적으로 공유되었습니다.');
        await fetchAllData(localUser);
      } catch (error) {
        alert(error.message || '여행 계획 공유 중 오류가 발생했습니다.');
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!isOwner) return;
    try {
      const updateData = { username: editUsername, email: editEmail };
      if (editPassword) {
        updateData.password = editPassword;
      }
      await api.put('/auth/profile', updateData);
      alert('프로필 정보가 성공적으로 업데이트되었습니다.');
      
      // Correctly reload the profile and all associated data
      await loadUserProfile(); 

      setIsEditingProfile(false);
      setEditPassword('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || '프로필 업데이트 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return <p>사용자 정보를 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!localUser) {
    return <p>사용자 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <MypageContainer>
      <Title>{paramUserId ? `${localUser.username}님의 페이지` : '마이페이지'}</Title>
      {isEditingProfile && isOwner ? (
        <div>
          <h2>프로필 수정</h2>
          <FormGroup>
            <label>아이디:</label>
            <input type="text" value={localUser.userId} disabled />
          </FormGroup>
          <FormGroup>
            <label>이름:</label>
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <label>이메일:</label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <label>새 비밀번호 (선택 사항):</label>
            <input
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              placeholder="새 비밀번호를 입력하세요"
            />
          </FormGroup>
          <ButtonGroup>
            <Button onClick={handleUpdateProfile}>저장</Button>
            <Button onClick={() => setIsEditingProfile(false)}>취소</Button>
          </ButtonGroup>
        </div>
      ) : (
        <>
          <UserInfo>
            <p><strong>아이디:</strong> {localUser.userId}</p>
            <p><strong>이름:</strong> {localUser.username}</p>
            <p><strong>이메일:</strong> {localUser.email}</p>
          </UserInfo>
          {isOwner && (
            <ButtonGroup>
              <Button onClick={() => setIsEditingProfile(true)}>정보 수정</Button>
              <Button onClick={handleLogout}>로그아웃</Button>
              <WithdrawButton onClick={handleWithdraw}>회원 탈퇴</WithdrawButton>
            </ButtonGroup>
          )}
        </>
      )}

      <ScheduleContainer>
        <ScheduleSection>
          <h2>{paramUserId ? '작성한 여행 계획' : '내 여행 계획'}</h2>
          {mySchedules.length === 0 ? (
            <p>아직 작성된 여행 계획이 없습니다.</p>
          ) : (
            mySchedules.map((schedule) => (
              <ScheduleItem key={schedule.id}>
                <div onClick={() => navigate(`/schedule/${schedule.id}`)}>
                  <h3>{schedule.title || '제목 없음'}</h3>
                  <p>날짜: {schedule.date}</p>
                </div>
                {isOwner && (
                  <ButtonGroup>
                    <Button onClick={() => handleShare(schedule.id)}>공유</Button>
                    <Button onClick={() => handleDeleteSchedule(schedule.id)}>삭제</Button>
                  </ButtonGroup>
                )}
              </ScheduleItem>
            ))
          )}
        </ScheduleSection>

        <ScheduleSection>
          <h2>내가 공유한 여행 계획</h2>
          {sharedSchedules.length === 0 ? (
            <p>아직 공유한 여행 계획이 없습니다.</p>
          ) : (
            sharedSchedules.map((schedule) => (
              <ScheduleItem key={schedule.id} onClick={() => navigate(`/schedule/${schedule.id}`)}>
                <h3>{schedule.title || '제목 없음'}</h3>
                <p>날짜: {schedule.date}</p>
              </ScheduleItem>
            ))
          )}
        </ScheduleSection>
      </ScheduleContainer>
    </MypageContainer>
  );
}

export default Mypage;