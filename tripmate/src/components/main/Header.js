import React from 'react';
import '../../css/Header.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="logo">여행 플랫폼</div>
      <nav className="nav">
        <Link to="/">메인</Link>
        <Link to="/login" >로그인</Link>
        <a href="#">지도보기</a>
      </nav>
    </header>
  );
}

export default Header;