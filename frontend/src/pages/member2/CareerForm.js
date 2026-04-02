import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";

const CareerForm = () => {
  const [skillsInput, setSkillsInput] = useState("");
  const [interest, setInterest] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const skills = skillsInput.toLowerCase();

    const data = {
      python: skills.includes("python") ? 1 : 0,
      java: skills.includes("java") && !skills.includes("javascript") ? 1 : 0,
      ml: skills.includes("machine learning") || skills.includes("ml") ? 1 : 0,
      sql: skills.includes("sql") ? 1 : 0,
      web_dev:
        skills.includes("html") ||
        skills.includes("css") ||
        skills.includes("javascript")
          ? 1
          : 0,
      interest:
        interest.toLowerCase() === "ai"
          ? 0
          : interest.toLowerCase() === "web"
          ? 1
          : interest.toLowerCase() === "data"
          ? 2
          : 3,
      cgpa: 8,
      projects: 3,
    };

    const res = await fetch("http://127.0.0.1:8000/career/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    navigate("/career-result", { state: result });
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          Career Recommendation
        </h2>

        {/* Skills Input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
            Enter Skills:
          </label>
          <input
            type="text"
            placeholder="e.g. html, css, python..."
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Interest Input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
            Enter Interest:
          </label>
          <input
            type="text"
            placeholder="e.g. ai, web, data, cyber"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
        >
          Get Recommendation
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CareerForm;
