import React, { useEffect, useState } from "react";
import API from "../services/api";
import ScoreGraph from "../components/ScoreGraph";

const Dashboard = () => {
  const [performance, setPerformance] = useState({});
  const [trend, setTrend] = useState({});
  const [forecast, setForecast] = useState({});
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const perf = await API.get("/analytics/performance");
    const tr = await API.get("/analytics/trend");
    const fc = await API.get("/analytics/forecast");
    const graph = await API.get("/analytics/graph");

    setPerformance(perf.data);
    setTrend(tr.data);
    setForecast(fc.data);

    // Combine dates and scores
    const combined = graph.data.dates.map((date, index) => ({
      date,
      score: graph.data.scores[index],
    }));

    setGraphData(combined);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>AI Career Dashboard</h1>

      <h2>Performance Summary</h2>
      <p>Total Tests: {performance.total_tests}</p>
      <p>Average Score: {performance.average_score}</p>
      <p>Best Subject: {performance.best_subject}</p>
      <p>Weak Subject: {performance.weak_subject}</p>

      <h2>Trend</h2>
      <p>{trend.trend}</p>

      <h2>Forecast</h2>
      <p>Next Predicted Score: {forecast.predicted_next_score}</p>

      <h2>Performance Graph</h2>
      <ScoreGraph data={graphData} />
    </div>
  );
};

export default Dashboard;