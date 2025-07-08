import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import api from '../api/index'; // api 인스턴스 import
import { fetchSchedules, fetchSharedSchedules, fetchUserProfile } from '../api/UserApi';

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

const ScheduleList = styled.div`
  margin-top: 2rem;
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
  const { userId: paramUserId } = useParams(); // URL에서 userId 받기 (UserPage 기능)
  const [localUser, setLocalUser] = useState(null); // 페이지에 보여줄 유저 정보
  const [mySchedules, setMySchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [scheduleError, setScheduleError] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [error, setError] = useState(null);
  const [sharedSchedules, setSharedSchedules] = useState([]);
  const [loadingSharedSchedules, setLoadingSharedSchedules] = useState(true);
  const [sharedScheduleError, setSharedScheduleError] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setIsLoadingUser(true);
        setError(null);
        const profile = await fetchUserProfile(paramUserId, user);
        setLocalUser(profile);
        setIsEditingProfile(false);
      } catch (err) {
        setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
        setLocalUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };
    getUserProfile();
  }, [paramUserId, user]);

  useEffect(() => {
    if (localUser) {
      setEditUsername(localUser.username || '');
      setEditEmail(localUser.email || '');
    }
  }, [localUser]);
//내가 작성한 여행계획
  useEffect(() => {
    const getSchedules = async () => {
      if (!localUser) {
        setLoadingSchedules(false);
        return;
      }
      try {
        setLoadingSchedules(true);
        const schedules = await fetchSchedules(localUser, paramUserId);
        setMySchedules(schedules);
        setScheduleError(null);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setScheduleError('로그인이 필요합니다.');
        } else {
          setScheduleError(error.message || '내 여행 계획을 불러오는데 실패했습니다.');
        }
        setMySchedules([]);
      } finally {
        setLoadingSchedules(false);
      }
    };
    getSchedules();
  }, [localUser, paramUserId]);

  //여행 계획 공유 일정 불러오기 
  useEffect(() => {
    const getSharedSchedules = async () => {
      if (!localUser) {
        setLoadingSharedSchedules(false);
        return;
      }
      try {
        setLoadingSharedSchedules(true);
        const shared = await fetchSharedSchedules(localUser.userId);
        setSharedSchedules(shared);
        setSharedScheduleError(null);
      } catch (error) {
        setSharedScheduleError(error.message || '공유한 여행 계획을 불러오는데 실패했습니다.');
        setSharedSchedules([]);
      } finally {
        setLoadingSharedSchedules(false);
      }
    };
    getSharedSchedules();
  }, [localUser, user]);

  // 현재 로그인한 유저와 페이지의 유저가 같으면 true (수정 및 삭제 권한)
  const isOwner = user && localUser && user.userId === localUser.userId;

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  const handleWithdraw = async () => {
    if (!isOwner) return; // 다른 유저 페이지면 동작 안 함
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
    if (!isOwner) return; // 다른 유저 페이지면 동작 안 함
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

  const handleEditToggle = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const handleUpdateProfile = async () => {
    if (!isOwner) return; // 다른 유저 페이지면 동작 안 함
    try {
      const updateData = {
        username: editUsername,
        email: editEmail,
      };
      if (editPassword) {
        updateData.password = editPassword;
      }
      await api.put('/auth/profile', updateData);
      alert('프로필 정보가 성공적으로 업데이트되었습니다.');
      const updatedUser = { ...localUser, username: editUsername, email: editEmail };
      setLocalUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditingProfile(false);
      setEditPassword('');
    } catch (error) {
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  if (isLoadingUser) {
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
            <Button onClick={handleEditToggle}>취소</Button>
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
              <Button onClick={handleEditToggle}>정보 수정</Button>
              <Button onClick={handleLogout}>로그아웃</Button>
              <WithdrawButton onClick={handleWithdraw}>회원 탈퇴</WithdrawButton>
            </ButtonGroup>
          )}
        </>
      )}

      <ScheduleContainer>
        <ScheduleSection>
          <h2>{paramUserId ? '작성한 여행 계획' : '내 여행 계획'}</h2>
          {loadingSchedules && <p>여행 계획을 불러오는 중...</p>}
          {scheduleError && <p style={{ color: 'red' }}>{scheduleError}</p>}
          {!loadingSchedules && !scheduleError && mySchedules.length === 0 && (
            <p>아직 작성된 여행 계획이 없습니다.</p>
          )}
          {!loadingSchedules && !scheduleError && mySchedules.length > 0 && (
            mySchedules.map((schedule) => (
              <ScheduleItem key={schedule.id}>
                <div onClick={() => navigate(`/schedule/${schedule.id}`)}>
                  <h3>{schedule.title || '제목 없음'}</h3>
                  <p>날짜: {schedule.date}</p>
                </div>
                {isOwner && (
                  <Button onClick={() => handleDeleteSchedule(schedule.id)}>삭제</Button>
                )}
              </ScheduleItem>
            ))
          )}
        </ScheduleSection>

        <ScheduleSection>
          <h2>내가 공유한 여행 계획</h2>
          {loadingSharedSchedules && <p>공유한 여행 계획을 불러오는 중...</p>}
          {sharedScheduleError && <p style={{ color: 'red' }}>{sharedScheduleError}</p>}
          {!loadingSharedSchedules && !sharedScheduleError && sharedSchedules.length === 0 && (
            <p>아직 공유한 여행 계획이 없습니다.</p>
          )}
          {!loadingSharedSchedules && !sharedScheduleError && sharedSchedules.length > 0 && (
            sharedSchedules.map((schedule) => (
              <ScheduleItem key={schedule.id}>
                <div onClick={() => navigate(`/schedule/${schedule.id}`)}>
                  <h3>{schedule.title || '제목 없음'}</h3>
                  <p>날짜: {schedule.date}</p>
                </div>
                {/* 공유한 여행은 삭제 권한 없다고 가정 */}
              </ScheduleItem>
            ))
          )}
        </ScheduleSection>
      </ScheduleContainer>

    </MypageContainer>
  );
}

export default Mypage;