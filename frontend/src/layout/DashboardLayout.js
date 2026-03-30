import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const role = localStorage.getItem("role");
  
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static z-30
          top-0 left-0 h-full
          w-64 bg-white shadow-md p-6
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h2 className="text-2xl font-bold mb-8 text-blue-600">
          AI Career
        </h2>
          
        <nav className="flex flex-col gap-4">
           
          <Link
            to="/dashboard"
            className="hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/analysis"
            className="hover:text-blue-600"
          >
            Test Analysis
          </Link>
          <Link
            to="/history"
            className="hover:text-blue-600"
          >
            Test History
          </Link>
            <Link 
            to="/test" 
            className="hover:text-blue-600">
            Take Test
            </Link>
            <Link 
            to="/leaderboard" 
            className="hover:text-blue-600">
            Leaderboard Here
            </Link>
            <Link 
            to="/practice" 
            className="hover:text-blue-600">
            Do practice
            </Link>
            <Link to="/tasks" className="hover:text-blue-600">
            📋 Tasks
          </Link>
          <button
            onClick={logout}
            className="text-left hover:text-red-500"
          >
            Logout
          </button>
          {/* 🔥 ADMIN SECTION */}
          {role === "admin" && (
            <>
              <hr />
              <p className="text-gray-400 text-sm mt-2">Admin Panel</p>

              <Link
                to="/admin/add-question"
                className="hover:text-blue-600"
                onClick={() => setSidebarOpen(false)}
              >
                ➕ Add Question
              </Link>
              <Link to="/admin/manage-questions" className="hover:text-blue-600">
              📋 Manage Questions
            </Link>
            </>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex items-center md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl"
          >
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