import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #2563eb; /* Tailwind의 bg-blue-600 */
  color: white;
  padding: 0.75rem 1rem; /* py-3 px-4 */
  display: flex;
  gap: 1rem; /* space-x-4 */
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Navbar = () => {
  return (
    <Nav>
      <StyledLink to="/">일정 만들기</StyledLink>
      <StyledLink to="/planner">여행지 추천</StyledLink>
      <StyledLink to="/schedule">스케줄 추천</StyledLink>
      <StyledLink to="/my-schedule">🙍‍♀️</StyledLink>
    </Nav>
  );
};

export default Navbar;
