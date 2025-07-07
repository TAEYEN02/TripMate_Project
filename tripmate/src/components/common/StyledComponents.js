import styled from 'styled-components';

//SignUp
export const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fafb;
`;

export const Form = styled.form`
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #2563eb;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  margin-bottom: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: #2563eb;
    outline: none;
  }
`;

export const Button = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width:400px;

  &:hover {
    background: #1d4ed8;
  }
`;

export const ButtonWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ErrorMessage = styled.p`
  color: #dc2626;
  text-align: center;
  font-size: 0.95rem;
  margin-bottom: 1rem;
`;

export const FindAccountLink = styled.button`
  margin-top: 1.5rem;
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #1d4ed8;
  }
`;

export const FindAccountWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const Separator = styled.span`
  color: #9ca3af;
  font-size: 0.9rem;
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




export const CityGridBlock = styled.div`
      padding: 2rem;
      background: #f8f9fa;
    `;

export const Grid = styled.div`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.5rem;
    `;

export const CityItem = styled.div`
      background: linear-gradient(135deg, #6e8efb, #a777e3);
      color: white;
      border-radius: 12px;
      padding: 2rem 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
      }
    `;