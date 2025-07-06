import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const ButtonWrap = styled.div`
  width: 100%;
  margin-top: 10px;
`;

export const Separator = styled.div`
  height: 15px;
  border-left: 1px solid #ccc;
  margin: 0 10px;
`;

export const FindAccountLink = styled.a`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const FindAccountWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

// UserPage styles
export const UserPageWrapper = styled.div`
  padding: 20px;
`;

export const InfoWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
`;

export const ProfileImg = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserInfo = styled.div`
  .info_name {
    font-size: 24px;
    font-weight: bold;
  }

  .info_postnum {
    margin: 10px 0;
  }

  .info_intro {
    color: #555;
  }

  .setting_bt {
    background: none;
    border: none;
    cursor: pointer;
    img {
      width: 24px;
      height: 24px;
    }
  }
`;

export const UserTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;

  button {
    padding: 10px 20px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 16px;

    &.active {
      border-bottom: 2px solid #007bff;
      font-weight: bold;
    }
  }
`;

export const TabContent = styled.div``;

export const UserSchedule = styled.div`
  .new_post_bt {
    background: none;
    border: none;
    cursor: pointer;
    img {
      width: 50px;
      height: 50px;
    }
  }
`;

export const PostItem = styled.div`
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  cursor: pointer;

  .post_title {
    font-size: 20px;
    font-weight: bold;
  }

  .post_images {
    display: flex;
    gap: 10px;
    margin: 10px 0;
    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
  }

  .post_categories {
    .post_category {
      background-color: #eee;
      padding: 5px 10px;
      border-radius: 15px;
      margin-right: 5px;
    }
  }
`;

export const UserInfoTab = styled.div`
  p {
    margin-bottom: 10px;
  }
`;

export const UserReviews = styled.div`
  .review_item {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
  }
`;
