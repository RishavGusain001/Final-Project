import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

const TestHistoryPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/test/performance");
      console.log("Attempts:", res.data);
      setAttempts(res.data || []);
    } catch (err) {
      console.error("Error fetching attempts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalysis = (id) => {
    if (!id) {
      alert("Invalid attempt ID");
      return;
    }
    console.log("Navigating to:", id);
    navigate(`/analysis/${id}`);
  };

  // Get unique subjects for filter
  const subjects = ["all", ...new Set(attempts.map(a => a.subject).filter(Boolean))];
  
  // Filter attempts
  const filteredAttempts = filter === "all" 
    ? attempts 
    : attempts.filter(a => a.subject === filter);

  // Calculate statistics
  const totalTests = filteredAttempts.length;
  const averageScore = totalTests > 0 
    ? (filteredAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalTests).toFixed(1)
    : 0;
  const totalQuestions = filteredAttempts.reduce((sum, a) => sum + (a.total_questions || 0), 0);
  const totalCorrect = filteredAttempts.reduce((sum, a) => sum + (a.score || 0), 0);

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 70) return "text-green-600 bg-green-50";
    if (percentage >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreEmoji = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 70) return "🎉";
    if (percentage >= 50) return "📘";
    return "📚";
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Test History
          </h1>
          <p className="text-gray-600">
            Track your performance and view detailed analysis of your tests
          </p>
        </div>

        {/* Statistics Cards */}
        {!loading && filteredAttempts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Total Tests</span>
                <span className="text-2xl">📝</span>
              </div>
              <div className="text-3xl font-bold text-gray-800">{totalTests}</div>
              <div className="text-sm text-gray-500 mt-1">practice attempts</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Average Score</span>
                <span className="text-2xl">⭐</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">{averageScore}%</div>
              <div className="text-sm text-gray-500 mt-1">
                {totalCorrect} / {totalQuestions} correct
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Accuracy</span>
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {totalCorrect} correct answers
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        {!loading && attempts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-gray-600 font-medium">Filter by subject:</span>
              <div className="flex gap-2 flex-wrap">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setFilter(subject)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === subject
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {subject === "all" ? "All Subjects" : subject}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading your test history...</p>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading && filteredAttempts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No test attempts yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start practicing to see your test history here
            </p>
            <button
              onClick={() => navigate("/practice")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Take a Practice Test →
            </button>
          </div>
        )}

        {/* Test History Table */}
        {!loading && filteredAttempts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Score
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Accuracy
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAttempts.map((attempt, index) => {
                    const percentage = attempt.total_questions > 0 
                      ? ((attempt.score / attempt.total_questions) * 100).toFixed(1)
                      : 0;
                    
                    return (
                      <tr 
                        key={attempt.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="font-medium">
                            {attempt.attempted_at
                              ? new Date(attempt.attempted_at).toLocaleDateString()
                              : "N/A"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {attempt.attempted_at
                              ? new Date(attempt.attempted_at).toLocaleTimeString()
                              : ""}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                            {attempt.subject || "Mixed"}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 text-center">
                          <div className="font-semibold text-gray-800">
                            {attempt.score ?? 0} / {attempt.total_questions ?? 0}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(attempt.score, attempt.total_questions)}`}>
                            {getScoreEmoji(attempt.score, attempt.total_questions)} {percentage}%
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewAnalysis(attempt.id)}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
                          >
                            View Analysis
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Stats Footer */}
        {!loading && filteredAttempts.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
            Showing {filteredAttempts.length} of {attempts.length} test{attempts.length !== 1 ? 's' : ''}
            {filter !== "all" && ` in ${filter}`}
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default TestHistoryPage;