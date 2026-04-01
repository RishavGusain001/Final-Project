import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CareerForm = () => {
  const [skillsInput, setSkillsInput] = useState("");
  const [interest, setInterest] = useState("");

  const navigate = useNavigate(); // ✅ inside component

  const handleSubmit = async () => {
    const skills = skillsInput.toLowerCase();

    const data = {
      python: skills.includes("python") ? 1 : 0,

      // 🔥 FIX
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

    console.log("Sending:", data);

    const res = await fetch("http://127.0.0.1:8000/career/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    // ✅ NAVIGATE TO RESULT PAGE
    navigate("/career-result", { state: result });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Career Recommendation</h2>

      <input
        type="text"
        placeholder="Enter skills (html, css, python...)"
        value={skillsInput}
        onChange={(e) => setSkillsInput(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Enter interest (ai, web, data, cyber)"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>Get Recommendation</button>
    </div>
  );
};

export default CareerForm;