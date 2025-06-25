import PlannerPage from './pages/PlannerPage';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './componets/common/Navbar';
import StartPlannerPage from './pages/StartPlannerPage';

function App() {
  return (
    <Router>
      <Navbar /> {/* 네비게이션 공통 UI */}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<StartPlannerPage />} />
          <Route path="/planner" element={<PlannerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
