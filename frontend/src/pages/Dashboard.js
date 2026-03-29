import React, { useEffect, useState } from "react";
import API from "../services/api";
import ScoreGraph from "../components/ScoreGraph";
import DashboardLayout from "../layout/DashboardLayout";

const Dashboard = () => {
  const [performance, setPerformance] = useState({});
  const [trend, setTrend] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [aiInsights, setAiInsights] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const perf = await API.get("/analytics/performance");
    const tr = await API.get("/analytics/trend");
    const graph = await API.get("/analytics/graph");
    const ai = await API.get("/analytics/ai-insights");
    
    setAiInsights(ai.data);
    setPerformance(perf.data);
    setTrend(tr.data);

    // Combine dates and scores
    const dates = graph.data?.dates || [];
    const scores = graph.data?.scores || [];

    const combined = dates.map((date, index) => ({
      date,
      score: scores[index],
    }));

    setGraphData(combined);
  };

  return (
    <DashboardLayout>
    <div style={{ maxWidth: "900px", margin: "auto" }}>
    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p className="text-gray-500">Total Tests</p>
        <h2 className="text-2xl font-bold">{performance.total_tests || 0}</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p className="text-gray-500">Average Score</p>
        <h2 className="text-2xl font-bold">{performance.average_score || 0}</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p className="text-gray-500">Best Subject</p>
        <h2 className="text-2xl font-bold">{performance.best_subject || 0}</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p className="text-gray-500">Weak Subject</p>
        <h2 className="text-2xl font-bold text-red-500">
          {performance.weak_subject || 0}
        </h2>
      </div>
    </div>

    {/* Trend & Forecast */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p className="text-gray-500">Trend</p>
        <h2 className="text-xl font-semibold">{trend.trend || 0}</h2>
      </div>
    </div>

  <h2 className="mt-6 text-xl font-bold">🤖 AI Insights</h2>
  {aiInsights.message ? (
    <div style={{
      background: "#f9fafb",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "10px",
      border: "1px solid #e5e7eb"
    }}>
      <p style={{ color: "#6b7280" }}>
        No data available yet. Attempt a test to get insights.
      </p>
    </div>
  ) : (
    <div style={{
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      color: "white",
      padding: "20px",
      borderRadius: "15px",
      marginTop: "10px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
    }}>
      
      <p style={{ fontSize: "18px", marginBottom: "10px" }}>
        📉 Weak Subject: <strong>{aiInsights.weak_subject}</strong>
      </p>

      <p style={{ fontSize: "16px", marginBottom: "10px" }}>
        🎯 Accuracy: <strong>{aiInsights.accuracy}%</strong>
      </p>

      <p style={{ fontSize: "16px", marginBottom: "15px" }}>
        💡 Recommendation: <strong>{aiInsights.recommendation}</strong>
      </p>

      <button
        style={{
          background: "white",
          color: "#6366f1",
          padding: "10px 15px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold"
        }}
        onClick={() => window.location.href = "/practice"}
      >
        🚀 Start Practice
      </button>

    </div>
  )}

    {/* Graph */}
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2>Performance Graph</h2>
      {graphData.length === 0 ? (
        <p className="text-gray-500 mt-2">
          No test attempts yet. Start your first test!
        </p>
      ) : (
        <ScoreGraph data={graphData} />
      )}
    </div>

  </div>
    </DashboardLayout>
  );
};

export default Dashboard;