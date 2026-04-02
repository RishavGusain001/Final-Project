import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import axios from "axios";

const CareerResult = () => {
  const location = useLocation();
  const { top_careers } = location.state || { top_careers: [] };
  const [roadmapData, setRoadmapData] = useState({});
  
  const fetchRoadmap = (career) => {
    axios.get(`http://127.0.0.1:8000/career/roadmap/${encodeURIComponent(career)}`)
      .then(res => {
        setRoadmapData(prev => ({ ...prev, [career]: res.data }));
      })
      .catch(err => console.error("Error fetching roadmap:", err));
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "30px" }}>
        <h2 style={{ marginBottom: "20px" }}>Top Career Recommendations</h2>

        {top_careers.map((careerObj, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "25px",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              background: "#f9f9f9",
            }}
          >
            <h3>{careerObj.career}</h3>
            <p><strong>Match Score:</strong> {careerObj.score}%</p>

            <button
              onClick={() => fetchRoadmap(careerObj.career)}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              View Roadmap
            </button>

            {/* Inline Roadmap */}
            {roadmapData[careerObj.career] && roadmapData[careerObj.career].length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h4>{careerObj.career} Roadmap 🚀</h4>
                {roadmapData[careerObj.career].map((step) => (
                  <div
                    key={step.step}
                    style={{
                      marginTop: "10px",
                      border: "1px solid #ddd",
                      padding: "10px",
                      borderRadius: "8px",
                      background: "#fff",
                    }}
                  >
                    <h5>Step {step.step}: {step.title}</h5>
                    <p>{step.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default CareerResult;
