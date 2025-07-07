import React, { useEffect, useState } from 'react'; // ✅ useEffect, useState 추가
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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

function Mypage() {
  const { user, logout, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(user); // ✅ user 없을 때를 대비한 fallback

  useEffect(() => {
    if (!user) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setLocalUser(JSON.parse(savedUser));
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  const handleWithdraw = async () => {
    if (window.confirm('정말로 회원 탈퇴를 하시겠습니까?')) {
      try {
        const headers = getAuthHeaders();
        await axios.delete('/api/auth/withdraw', { headers });
        logout();
        alert('회원 탈퇴가 완료되었습니다.');
        navigate('/');
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert('회원 탈퇴 중 오류가 발생했습니다.');
      }
    }
  };

  if (!localUser) {
    return <p>로그인이 필요합니다.</p>;
  }

  return (
    <MypageContainer>
      <Title>마이페이지</Title>
      <UserInfo>
        <p><strong>아이디:</strong> {localUser.userId}</p>
        <p><strong>이름:</strong> {localUser.username}</p>
        <p><strong>이메일:</strong> {localUser.email}</p>
      </UserInfo>
      <ButtonGroup>
        <Button onClick={handleLogout}>로그아웃</Button>
        <WithdrawButton onClick={handleWithdraw}>회원 탈퇴</WithdrawButton>
      </ButtonGroup>
    </MypageContainer>
  );
}

export default Mypage;
