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
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff", // clean white background
          padding: "40px",
        }}
      >
        <h2
          style={{
            marginBottom: "30px",
            fontSize: "32px",
            fontWeight: "700",
            color: "#1565c0", // professional blue
          }}
        >
          Top Career Recommendations
        </h2>

        {top_careers.map((careerObj, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "30px",
              padding: "20px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              background: "#fafafa",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                marginBottom: "10px",
                fontSize: "22px",
                fontWeight: "600",
                color: "#0d47a1",
              }}
            >
              {careerObj.career}
            </h3>
            <p style={{ fontSize: "15px", color: "#333" }}>
              <strong>Match Score:</strong> {careerObj.score}%
            </p>

            <button
              onClick={() => fetchRoadmap(careerObj.career)}
              style={{
                marginTop: "15px",
                padding: "12px 24px",
                backgroundColor: "#1565c0",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
                transition: "background-color 0.3s ease, transform 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#0d47a1";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#1565c0";
                e.target.style.transform = "scale(1)";
              }}
            >
              View Roadmap
            </button>

            {/* Inline Roadmap */}
            {roadmapData[careerObj.career] &&
              roadmapData[careerObj.career].length > 0 && (
                <div style={{ marginTop: "25px" }}>
                  <h4
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#1565c0",
                      marginBottom: "15px",
                    }}
                  >
                    {careerObj.career} Roadmap 🚀
                  </h4>
                  {roadmapData[careerObj.career].map((step) => (
                    <div
                      key={step.step}
                      style={{
                        marginBottom: "15px",
                        border: "1px solid #ddd",
                        padding: "15px",
                        borderRadius: "6px",
                        background: "#fff",
                      }}
                    >
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: "#0d47a1",
                        }}
                      >
                        Step {step.step}: {step.title}
                      </h5>
                      <p style={{ fontSize: "14px", color: "#444" }}>
                        {step.description}
                      </p>
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
