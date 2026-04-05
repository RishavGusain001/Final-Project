import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔥 Only ONE dropdown active
  const [activeMenu, setActiveMenu] = useState(null);

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
        transform transition-transform duration-300 overflow-y-auto
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
            className="no-underline text-gray-800 font-semibold transition flex items-center gap-2 hover:text-blue-600 text-[15px]"
          >
            🏠 Dashboard
          </Link>
          <Link
            to="/notes"
            className="no-underline text-gray-800 font-semibold transition flex items-center gap-2 hover:text-blue-600 text-[15px]"
          >
            📝 Notes
          </Link>

          {/* TEST */}
          <div>
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "test" ? null : "test")
              }
              className="flex justify-between items-center w-full hover:text-blue-600 font-bold text-[15.5px]"
            >
              <span className="flex items-center gap-2">🧪 Tests</span>
              <span>{activeMenu === "test" ? "▲" : "▼"}</span>
            </button>

            {activeMenu === "test" && (
              <div className="ml-6 mt-2 flex flex-col gap-2">
                <Link to="/test" className="no-underline text-gray-800 hover:text-blue-600 font-medium text-[14px]">📝 Take Test</Link>
                <Link to="/analysis" className="no-underline text-gray-800 hover:text-blue-600 font-medium text-[14px]">📊 Analysis</Link>
                <Link to="/history" className="no-underline text-gray-800 hover:text-blue-600 font-medium text-[14px]">📜 History</Link>
                <Link to="/practice" className="no-underline text-gray-800 hover:text-blue-600 font-medium text-[14px]">🎯 Practice</Link>
              </div>
            )}
          </div>

          {/* RESUME */}
          <div>
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "resume" ? null : "resume")
              }
              className="flex justify-between items-center w-full hover:text-blue-600 font-bold text-[15.5px]"
            >
              <span className="flex items-center gap-2">📄 Resume</span>
              <span>{activeMenu === "resume" ? "▲" : "▼"}</span>
            </button>

            {activeMenu === "resume" && (
              <div className="ml-6 mt-2 flex flex-col gap-2">
                <Link to="/resume" className="no-underline text-gray-800 hover:text-blue-600 font-medium text-[14px]">📊 Resume Analysis</Link>
                <Link to="/resume/builder" className="no-underline text-gray-800 hover:text-blue-600 font-medium text-[14px]">🧾 Resume Builder</Link>
                <Link to="/resume/history" className="no-underline text-gray-800 hover:text-blue-600 font-medium text-[14px]">🕒 Resume History</Link>
              </div>
            )}
          </div>

          {/* CAREER */}
          <div>
            <button
              onClick={() =>
                setActiveMenu(activeMenu === "career" ? null : "career")
              }
              className="flex justify-between items-center w-full hover:text-blue-600 font-bold text-[15.5px]"
            >
              <span className="flex items-center gap-2">🎯 Career</span>
              <span>{activeMenu === "career" ? "▲" : "▼"}</span>
            </button>

            {activeMenu === "career" && (
              <div className="ml-6 mt-2 flex flex-col gap-2">
                <Link to="/career" className="no-underline text-gray-800 hover:text-blue-600 font-medium text-[14px]">📌 Recommendation</Link>
                <Link to="/roadmap" className="no-underline text-gray-800 hover:text-blue-600 font-medium text-[14px]">🗺️ Roadmap</Link>
                <Link to="/skill-gap" className="no-underline text-gray-800 hover:text-blue-600 font-medium text-[14px]">📉 Skill Gap</Link>
              </div>
            )}
          </div>
            <Link
            to="/tasks"
            className="no-underline text-gray-800 font-semibold transition flex items-center gap-2 hover:text-blue-600 text-[15px]"
          >
            📋 Tasks
          </Link>
          <Link
            to="/leaderboard"
            className="no-underline text-gray-800 font-semibold transition flex items-center gap-2 hover:text-blue-600 text-[15px]"
          >
            🏆 Leaderboard
          </Link>
          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-left hover:text-red-500 mt-4 font-semibold text-[15px]"
          >
            🚪 Logout
          </button>

          {/* ADMIN */}
          {role === "admin" && (
            <>
              <hr className="my-3" />
              <p className="text-gray-400 text-sm font-medium">Admin Panel</p>

              <Link to="/admin/add-question" className="no-underline text-gray-800 hover:text-blue-600 font-semibold transition">
                ➕ Add Question
              </Link>

              <Link to="/admin/manage-questions" className="no-underline text-gray-800 hover:text-blue-600 font-semibold transition">
                🛠 Manage Questions
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Mobile Top */}
        <div className="bg-white shadow-sm p-4 flex items-center md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl">
            ☰
          </button>
          <h1 className="ml-4 font-semibold">Dashboard</h1>
        </div>

        {/* 🔥 FIXED SCROLL AREA */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
          {children}
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;