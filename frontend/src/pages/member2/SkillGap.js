import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { ProgressBar, Spinner } from "react-bootstrap";
import axios from "axios";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function SkillGap() {
  const [careerName, setCareerName] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [gapData, setGapData] = useState(null);
  const [careerOptions, setCareerOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null); // ✅ new state for roadmap

  // Fetch career list
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/career/careers")
      .then(res => setCareerOptions(res.data))
      .catch(err => console.error("Error fetching careers:", err));
  }, []);

  const handleSubmit = () => {
    if (!careerName) return;

    setLoading(true);
    const skillsArray = skillsInput
      .split(",")
      .map(s => s.trim().toLowerCase())
      .filter(s => s);

    axios.post("http://127.0.0.1:8000/career/skill-gap", {
      career_name: careerName,
      user_skills: skillsArray
    })
    .then(res => {
      setGapData(res.data);
      setRoadmapData(null); // reset roadmap when new analysis runs
    })
    .catch(err => console.error("API Error:", err))
    .finally(() => setLoading(false));
  };

  const fetchRoadmap = () => {
    if (!gapData?.career) return;
    axios.get(`http://127.0.0.1:8000/career/roadmap/${encodeURIComponent(gapData.career)}`)
      .then(res => setRoadmapData(res.data))
      .catch(err => console.error("Error fetching roadmap:", err));
  };

  const chartData = gapData ? {
    labels: gapData.skills || [],
    datasets: [
      {
        label: "Your Skills",
        data: gapData.student_scores || [],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: `${gapData.career} Required Skills`,
        data: gapData.required_scores || [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  } : null;

  return (
    <DashboardLayout>
      <div style={{ padding: "20px" }}>
        <h2>Skill Gap Analyzer</h2>

        {/* Career Dropdown */}
        <div style={{ marginBottom: "20px" }}>
          <label>Choose Career Path:</label>
          <select
            value={careerName}
            onChange={(e) => setCareerName(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="">-- Select Career --</option>
            {careerOptions.map((career, idx) => (
              <option key={idx} value={career}>{career}</option>
            ))}
          </select>
        </div>

        {/* Skills Input */}
        <div style={{ marginBottom: "20px" }}>
          <label>Enter Your Skills (comma separated):</label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g. Python, SQL, Excel"
            style={{ marginLeft: "10px", padding: "5px", width: "300px" }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!careerName || loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Analyze Gap"}
        </button>

        {/* Show results */}
        {gapData && (
          <>
            <h3 style={{ marginTop: "20px" }}>Career Path: {gapData.career}</h3>
            <p>
              <strong>Missing Skills:</strong>{" "}
              {gapData.missing && gapData.missing.length > 0
                ? gapData.missing.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")
                : "None 🎉"}
            </p>
            <p><strong>Overall Gap:</strong> {gapData.gap_percentage ?? 0}%</p>

            <ProgressBar now={gapData.compatibility ?? 0} label={`${gapData.compatibility ?? 0}% Compatibility`} />

            <div style={{ maxWidth: "500px", marginTop: "20px" }}>
              {chartData && <Radar data={chartData} />}
            </div>

            <h4 style={{ marginTop: "20px" }}>Recommendations:</h4>
            <ul>
              {gapData.recommendations && gapData.recommendations.length > 0 ? (
                gapData.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))
              ) : (
                <li>No recommendations 🎉</li>
              )}
            </ul>

            {/* Inline Roadmap */}
            <button
              onClick={fetchRoadmap}
              style={{
                marginTop: "20px",
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

            {roadmapData && roadmapData.length > 0 && (
              <div style={{ marginTop: "30px" }}>
                <h3>{gapData.career} Roadmap 🚀</h3>
                {roadmapData.map((step) => (
                  <div
                    key={step.step}
                    style={{
                      marginTop: "15px",
                      border: "1px solid #ccc",
                      padding: "15px",
                      borderRadius: "10px",
                      background: "#f9f9f9",
                    }}
                  >
                    <h4>
                      Step {step.step}: {step.title}
                    </h4>
                    <p>{step.description}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SkillGap;
