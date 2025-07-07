import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api'; // axios 인스턴스 import
import { useAuth } from '../context/AuthContext';

const UserPageContainer = styled.div`
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #e9ecef;
    border-radius: 8px;
`;

const UserProfile = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 2rem;
    object-fit: cover;
`;

const UserInfo = styled.div`
    h1 {
        font-size: 2rem;
        margin: 0;
    }
    p {
        font-size: 1.1rem;
        color: #6c757d;
    }
`;

const UserContent = styled.div`
    /* 추가적인 사용자 컨텐츠 (예: 작성한 글 목록) 스타일 */
`;

function UserPage() {
    const { userId } = useParams(); // URL에서 userId 파라미터 가져오기
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: loggedInUser } = useAuth(); // 현재 로그인한 사용자 정보

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/users/${userId}`);
                setUserProfile(response.data);
                setError(null);
            } catch (err) {
                setError('사용자 정보를 불러오는데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;
    if (!userProfile) return <p>사용자 정보를 찾을 수 없습니다.</p>;

    // 현재 로그인한 사용자와 페이지의 주인이 같은지 확인
    const isOwner = loggedInUser && loggedInUser.userId === userProfile.userId;

    return (
        <UserPageContainer>
            <UserProfile>
                {/* 임시 프로필 이미지 */}
                <ProfileImage src={`https://i.pravatar.cc/150?u=${userProfile.userId}`} alt="Profile" />
                <UserInfo>
                    <h1>{userProfile.username}</h1>
                    <p>@{userProfile.userId}</p>
                    <p>{userProfile.email}</p>
                </UserInfo>
            </UserProfile>

            {isOwner && (
                <div>
                    {/* 마이페이지와 동일한 로그아웃, 회원탈퇴 버튼 등을 여기에 추가할 수 있습니다. */}
                    {/* 예: <Link to="/settings">프로필 수정</Link> */}
                </div>
            )}

            <UserContent>
                <h2>작성한 여행 계획</h2>
                {/* 사용자가 작성한 여행 계획 목록 등을 여기에 렌더링 */}
            </UserContent>
        </UserPageContainer>
    );
}

export default UserPage;