import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../common/StyledComponents";

const Nav = styled.nav`
  background-color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  &:hover {
    color: #007bff;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const UserInfo = styled.span`
  font-weight: bold;
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Nav>
      <NavLink to="/">TripMate</NavLink>
      <NavItems>
        {user ? (
          <>
            <UserInfo>{user.sub}님 환영합니다!</UserInfo>
            <Link to="/my-schedule">내 일정</Link>
            <Button onClick={handleLogout}>로그아웃</Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate("/login")}>로그인</Button>
            <Button onClick={() => navigate("/signup")} style={{ marginLeft: "10px" }}>
              회원가입
            </Button>
          </>
        )}
      </NavItems>
    </Nav>
  );
};

export default Navbar;