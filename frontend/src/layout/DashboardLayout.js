import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [testOpen, setTestOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const role = localStorage.getItem("role");

  return (
    <div className="flex h-screen bg-gray-100 font-sans">

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static z-30 top-0 left-0 h-full w-64 bg-white shadow-lg p-6 
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Logo */}
        <h2 className="text-2xl font-bold mb-8 text-blue-600 tracking-wide">
          🚀 AI Career
        </h2>

        <nav className="flex flex-col gap-4 text-gray-800">

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 hover:text-blue-600 font-semibold text-[15px] tracking-wide"
          >
            🏠 Dashboard
          </Link>

          {/* TEST */}
          <div>
            <button
              onClick={() => setTestOpen(!testOpen)}
              className="flex justify-between items-center w-full hover:text-blue-600 font-bold text-[15.5px] tracking-wide"
            >
              <span className="flex items-center gap-2">
                🧪 Tests
              </span>
              <span>{testOpen ? "▲" : "▼"}</span>
            </button>

            {testOpen && (
              <div className="ml-6 mt-2 flex flex-col gap-2">
                <Link to="/test" className="hover:text-blue-600 font-medium text-[14px]">📝 Take Test</Link>
                <Link to="/analysis" className="hover:text-blue-600 font-medium text-[14px]">📊 Analysis</Link>
                <Link to="/history" className="hover:text-blue-600 font-medium text-[14px]">📜 History</Link>
                <Link to="/practice" className="hover:text-blue-600 font-medium text-[14px]">🎯 Practice</Link>
              </div>
            )}
          </div>

          {/* RESUME */}
          <div>
            <button
              onClick={() => setResumeOpen(!resumeOpen)}
              className="flex justify-between items-center w-full hover:text-blue-600 font-bold text-[15.5px] tracking-wide"
            >
              <span className="flex items-center gap-2">
                📄 Resume
              </span>
              <span>{resumeOpen ? "▲" : "▼"}</span>
            </button>

            {resumeOpen && (
              <div className="ml-6 mt-2 flex flex-col gap-2">
                <Link to="/resume" className="hover:text-blue-600 font-medium text-[14px]">⬆️ Upload</Link>
                <Link to="/resume/result" className="hover:text-blue-600 font-medium text-[14px]">📊 Analysis</Link>
                <Link to="/resume/history" className="hover:text-blue-600 font-medium text-[14px]">🕒 History</Link>
              </div>
            )}
          </div>

          {/* CAREER */}
          <div>
            <button
              onClick={() => setCareerOpen(!careerOpen)}
              className="flex justify-between items-center w-full hover:text-blue-600 font-bold text-[15.5px] tracking-wide"
            >
              <span className="flex items-center gap-2">
                🎯 Career
              </span>
              <span>{careerOpen ? "▲" : "▼"}</span>
            </button>

            {careerOpen && (
              <div className="ml-6 mt-2 flex flex-col gap-2">
                <Link to="/career" className="hover:text-blue-600 font-medium text-[14px]">📌 Recommendation</Link>
                <Link to="/roadmap" className="hover:text-blue-600 font-medium text-[14px]">🗺️ Roadmap</Link>
                <Link to="/skill-gap" className="hover:text-blue-600 font-medium text-[14px]">📉 Skill Gap</Link>
                <Link to="/tasks" className="hover:text-blue-600 font-medium text-[14px]">📋 Tasks</Link>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-left hover:text-red-500 mt-4 font-semibold text-[15px]"
          >
            🚪 Logout
          </button>
            <Link
            to="/leaderboard"
            className="flex items-center gap-2 hover:text-blue-600 font-semibold text-[15px] tracking-wide"
          >
            🏆 Leaderboard
          </Link>
          {/* ADMIN */}
          {role === "admin" && (
            <>
              <hr className="my-3" />
              <p className="text-gray-400 text-sm font-medium">Admin Panel</p>

              <Link to="/admin/add-question" className="hover:text-blue-600 font-medium text-[14px]">
                ➕ Add Question
              </Link>

              <Link to="/admin/manage-questions" className="hover:text-blue-600 font-medium text-[14px]">
                🛠 Manage Questions
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Mobile Top */}
        <div className="bg-white shadow-sm p-4 flex items-center md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl">
            ☰
          </button>
          <h1 className="ml-4 font-semibold">Dashboard</h1>
        </div>

        <div className="p-6 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;