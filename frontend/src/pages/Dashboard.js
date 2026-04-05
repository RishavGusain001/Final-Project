import React, { useEffect, useState } from "react";
import API from "../services/api";
import ScoreGraph from "../components/ScoreGraph";
import DashboardLayout from "../layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [performance, setPerformance] = useState({});
  const [trend, setTrend] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [aiInsights, setAiInsights] = useState({});
  const [username, setUsername] = useState("");
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // In Dashboard.js, add console logs to debug
const fetchData = async () => {
  try {
    console.log("Fetching performance data...");
    const perf = await API.get("/analytics/performance");
    console.log("Performance response:", perf.data);
    
    const graph = await API.get("/analytics/graph");
    console.log("Graph response:", graph.data);
    
    // Set data only if it exists
    if (perf.data) setPerformance(perf.data);
    if (graph.data?.dates && graph.data?.scores) {
      const combined = graph.data.dates.map((date, index) => ({
        date,
        score: graph.data.scores[index],
      }));
      setGraphData(combined);
    }
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
  }
};

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;  

    try {
      const res = await API.get("/users/me");
      setUsername(res.data.name);
    } catch (err) {
      console.log("User fetch failed");
    }
  };
  
  const fetchStreak = async () => {
    try {
      const res = await API.get("/tasks/streak");
      setStreak(res.data.streak);
    } catch (err) {
      console.log("Streak fetch failed");
    }
  };  
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([fetchData(), fetchUser(), fetchStreak()]);
      setLoading(false);
    };
    loadAllData();
  }, []);

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 70) return "text-green-600";
    if (accuracy >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">
                  {getGreeting()}, <span className="text-blue-600">{username || "Learner"}!</span>
                </h1>
                <p className="text-gray-500">Here's your learning progress summary</p>
              </div>
              <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                <span className="text-orange-600 font-semibold">🔥 {streak} day streak</span>
                <span className="text-sm text-gray-500 ml-2">Stay consistent!</span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading your dashboard...</p>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">Total Tests</span>
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">
                    {performance.total_tests || 0}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">practice attempts</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">Avg. Score</span>
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {performance.average_score || 0}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">overall accuracy</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">Best Subject</span>
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="text-xl font-bold text-green-600 truncate">
                    {performance.best_subject || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">your strongest area</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">Weak Subject</span>
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="text-xl font-bold text-red-600 truncate">
                    {performance.weak_subject || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">needs improvement</div>
                </div>
              </div>

              {/* Trend Section */}
              {trend.trend && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Performance Trend</p>
                      <h2 className="text-2xl font-bold text-gray-800">{trend.trend}</h2>
                    </div>
                    <div className="text-sm text-gray-500">
                      Based on your recent test attempts
                    </div>
                  </div>
                </div>
              )}

              {/* AI Insights Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🤖</span> AI Insights
                </h2>
                
                {!aiInsights.weak_subject && !aiInsights.accuracy ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                    <div className="text-5xl mb-3">📊</div>
                    <p className="text-gray-500">
                      No data available yet. Attempt a test to get AI-powered insights.
                    </p>
                    <p className="text-gray-500 bold">
                      Feature Adding Soon .... 
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 text-white">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <p className="text-indigo-200 text-sm mb-1">Weak Subject</p>
                          <p className="text-2xl font-bold">{aiInsights.weak_subject || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-indigo-200 text-sm mb-1">Current Accuracy</p>
                          <p className={`text-2xl font-bold ${getAccuracyColor(aiInsights.accuracy)}`}>
                            {aiInsights.accuracy || 0}%
                          </p>
                        </div>
                      </div>
                      
                      {aiInsights.recommendation && (
                        <div className="bg-white/10 rounded-lg p-4 mb-6">
                          <p className="text-sm text-indigo-200 mb-1">💡 Recommendation</p>
                          <p className="font-medium">{aiInsights.recommendation}</p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => navigate("/practice")}
                        className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition shadow-md"
                      >
                        🚀 Start Practice Now
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Performance Graph */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                  <h2 className="text-xl font-bold text-gray-800">📈 Performance Trend</h2>
                  {graphData.length > 0 && (
                    <span className="text-sm text-gray-500">
                      Last {graphData.length} tests
                    </span>
                  )}
                </div>
                
                {graphData.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-3">📊</div>
                    <p className="text-gray-500">
                      No test attempts yet. Start your first test to see your progress!
                    </p>
                    <button
                      onClick={() => navigate("/practice")}
                      className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Take a Practice Test
                    </button>
                  </div>
                ) : (
                  <ScoreGraph data={graphData} />
                )}
              </div>
            </>
          )}
        </div>
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

export default Dashboard;