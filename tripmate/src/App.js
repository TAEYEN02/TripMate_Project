import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './components/common/Navbar';
import StartPlannerPage from './pages/StartPlannerPage';
import PlannerPage from './pages/SearchPage';
import SchedulePage from './pages/SchedulePage';
import './App.css';
import MySchedulePage from './pages/MySchedulePage';

// 앱 전체 컨테이너
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f7fafc;
`;

// 메인 콘텐츠 영역
const MainContent = styled.main`
  padding-top: 1rem;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Navbar />
        <MainContent>
          <Routes>
            <Route path="/" element={<StartPlannerPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path='/schedule' element={<SchedulePage/>}/>
            <Route path='/my-schedule'element={<MySchedulePage/>}/>
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;

