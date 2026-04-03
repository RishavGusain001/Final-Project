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
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff", // plain white background
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <h2
          style={{
            marginBottom: "30px",
            fontSize: "36px",
            fontWeight: "bold",
            color: "#1a237e", // professional blue
            textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          Career Recommendation
        </h2>

        {/* Skills Input */}
        <div style={{ marginBottom: "20px", width: "100%", maxWidth: "500px" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "8px",
              color: "#0d47a1",
              fontSize: "16px",
            }}
          >
            Enter Skills:
          </label>
          <input
            type="text"
            placeholder="e.g. html, css, python..."
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "2px solid #90caf9",
              fontSize: "15px",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
            onBlur={(e) => (e.target.style.borderColor = "#90caf9")}
          />
        </div>

        {/* Interest Input */}
        <div style={{ marginBottom: "20px", width: "100%", maxWidth: "500px" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "8px",
              color: "#0d47a1",
              fontSize: "16px",
            }}
          >
            Enter Interest:
          </label>
          <input
            type="text"
            placeholder="e.g. ai, web, data, cyber"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "2px solid #90caf9",
              fontSize: "15px",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
            onBlur={(e) => (e.target.style.borderColor = "#90caf9")}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!skillsInput.trim()}
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "16px",
            background: !skillsInput.trim()
              ? "#b0bec5"
              : "linear-gradient(90deg, #1e88e5, #0d47a1)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: !skillsInput.trim() ? "not-allowed" : "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            letterSpacing: "1px",
            transition: "transform 0.2s ease, background 0.3s ease",
          }}
          onMouseOver={(e) => {
            if (skillsInput.trim()) e.target.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            if (skillsInput.trim()) e.target.style.transform = "scale(1)";
          }}
        >
          Get Recommendation
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CareerForm;
