import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axios from "axios";

const Roadmap = () => {
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [roadmap, setRoadmap] = useState([]);

  // ✅ Fetch all careers for dropdown
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/career/careers")
      .then((res) => setCareers(res.data))
      .catch((err) => console.error("Error fetching careers:", err));
  }, []);

  // ✅ Fetch roadmap when career is selected
  useEffect(() => {
    if (selectedCareer) {
      axios
        .get(
          `http://127.0.0.1:8000/career/roadmap/${encodeURIComponent(
            selectedCareer
          )}`
        )
        .then((res) => setRoadmap(res.data))
        .catch((err) => console.error("Error fetching roadmap:", err));
    }
  }, [selectedCareer]);

  return (
    <DashboardLayout>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff", // clean white background
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // center heading and dropdown
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
            fontSize: "32px",
            fontWeight: "700",
            color: "#1565c0", // professional blue
            textAlign: "center",
          }}
        >
          Choose a Career Roadmap 🚀
        </h2>

        {/* Dropdown */}
        <select
          value={selectedCareer}
          onChange={(e) => setSelectedCareer(e.target.value)}
          style={{
            padding: "12px",
            marginBottom: "40px",
            borderRadius: "6px",
            border: "1px solid #90caf9",
            fontSize: "15px",
            outline: "none",
            width: "100%",
            maxWidth: "400px",
            transition: "border-color 0.3s ease",
            textAlign: "center",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#1565c0")}
          onBlur={(e) => (e.target.style.borderColor = "#90caf9")}
        >
          <option value="">-- Select a Career --</option>
          {careers.map((career) => (
            <option key={career} value={career}>
              {career}
            </option>
          ))}
        </select>

        {/* Roadmap display */}
        {selectedCareer && roadmap.length === 0 && (
          <div
            style={{
              marginTop: "20px",
              fontSize: "16px",
              color: "#555",
              fontStyle: "italic",
            }}
          >
            No Roadmap Found
          </div>
        )}

        {roadmap.length > 0 && (
          <div
            style={{
              marginTop: "20px",
              width: "100%",
              maxWidth: "700px",
            }}
          >
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#0d47a1",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {selectedCareer} Roadmap
            </h3>
            {roadmap.map((step) => (
              <div
                key={step.step}
                style={{
                  marginBottom: "20px",
                  border: "1px solid #e0e0e0",
                  padding: "18px",
                  borderRadius: "8px",
                  background: "#fafafa",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "10px",
                    color: "#1565c0",
                  }}
                >
                  Step {step.step}: {step.title}
                </h4>
                <p style={{ fontSize: "15px", color: "#444" }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Roadmap;
