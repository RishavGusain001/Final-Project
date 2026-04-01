import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TestPage from "./pages/TestPage";
import AnalysisPage from "./pages/AnalysisPage";
import PracticePage from "./pages/PracticePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import TestHistoryPage from "./pages/TestHistoryPage";
import AddQuestionPage from './pages/admin/AddQuestionPage';
import ManageQuestionsPage from "./pages/admin/ManageQuestionsPage";
import TaskPage from './pages/taskpage';
<<<<<<< HEAD
import CareerForm from "./pages/member2/CareerForm";
import CareerResult from "./pages/member2/CareerResult";
import SkillGap from "./pages/member2/SkillGap";
import Roadmap from "./pages/member2/Roadmap";
=======
import ResumeAnalysis from './pages/resume/ResumeAnalysis';
import ResumeUpload from './pages/resume/ResumeUpload';
>>>>>>> e10c8bf4b73c9cfb4f25e7e700d89a483b6e78aa

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/analysis/:id" element={<AnalysisPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/career" element={<CareerForm />} />
        <Route path="/career-result" element={<CareerResult />} />
        <Route path="/skill-gap" element={<SkillGap />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/history" element={<TestHistoryPage />} /> 
        <Route path="/admin/add-question" element={<AddQuestionPage />} />
        <Route path="/admin/manage-questions" element={<ManageQuestionsPage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/resume" element={<ResumeUpload />} />
        <Route path="/resume/result" element={<ResumeAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App;