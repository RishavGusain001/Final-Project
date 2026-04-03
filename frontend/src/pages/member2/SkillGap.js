import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { ProgressBar, Spinner } from "react-bootstrap";
import axios from "axios";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function SkillGap() {
  const [careerName, setCareerName] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [gapData, setGapData] = useState(null);
  const [careerOptions, setCareerOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);

  // Fetch career list
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/career/careers")
      .then((res) => setCareerOptions(res.data))
      .catch((err) => console.error("Error fetching careers:", err));
  }, []);

  const handleSubmit = () => {
    if (!careerName) return;

    setLoading(true);

    const skillsArray = skillsInput
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s);

    axios
      .post("http://127.0.0.1:8000/career/skill-gap", {
        career_name: careerName,
        user_skills: skillsArray,
      })
      .then((res) => {
        setGapData(res.data);
        setRoadmapData(null);
      })
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  };

  const fetchRoadmap = () => {
    if (!gapData?.career) return;

    axios
      .get(
        `http://127.0.0.1:8000/career/roadmap/${encodeURIComponent(
          gapData.career
        )}`
      )
      .then((res) => setRoadmapData(res.data))
      .catch((err) => console.error("Error fetching roadmap:", err));
  };

  const chartData = gapData
    ? {
        labels: gapData.skills || [],
        datasets: [
          {
            label: "Your Skills",
            data: gapData.student_scores || [],
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "#1e88e5",
            borderWidth: 2,
          },
          {
            label: `${gapData.career} Required Skills`,
            data: gapData.required_scores || [],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "#d32f2f",
            borderWidth: 2,
          },
        ],
      }
    : null;

  return (
    <DashboardLayout>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        {/* Heading */}
        <h2
          style={{
            marginBottom: "30px",
            fontSize: "36px",
            fontWeight: "bold",
            color: "#1a237e",
            textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          Skill Gap Analyzer
        </h2>

        {/* Career Dropdown */}
        <div style={{ marginBottom: "20px", width: "100%", maxWidth: "500px" }}>
          <label style={{ fontWeight: "bold", color: "#0d47a1" }}>
            Choose Career Path:
          </label>
          <select
            value={careerName}
            onChange={(e) => setCareerName(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "2px solid #90caf9",
              fontSize: "15px",
              marginTop: "8px",
            }}
          >
            <option value="">-- Select Career --</option>
            {careerOptions.map((career, idx) => (
              <option key={idx} value={career}>
                {career}
              </option>
            ))}
          </select>
        </div>

        {/* Skills Input */}
        <div style={{ marginBottom: "20px", width: "100%", maxWidth: "500px" }}>
          <label style={{ fontWeight: "bold", color: "#0d47a1" }}>
            Enter Your Skills:
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g. Python, SQL, Excel"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "2px solid #90caf9",
              fontSize: "15px",
              marginTop: "8px",
            }}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={!careerName || loading}
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "16px",
            background:
              !careerName || loading
                ? "#b0bec5"
                : "linear-gradient(90deg, #1e88e5, #0d47a1)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: !careerName || loading ? "not-allowed" : "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Analyze Gap"}
        </button>

        {/* Results Section */}
        {gapData && (
          <div
            style={{
              marginTop: "40px",
              width: "100%",
              maxWidth: "600px",
              background: "#f5f9ff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ color: "#1a237e" }}>
              Career: {gapData.career}
            </h3>

            <p>
              <strong>Missing Skills:</strong>{" "}
              {gapData.missing?.length
                ? gapData.missing.join(", ")
                : "None 🎉"}
            </p>

            <p>
              <strong>Overall Gap:</strong>{" "}
              {gapData.gap_percentage ?? 0}%
            </p>

            <ProgressBar
              now={gapData.compatibility ?? 0}
              label={`${gapData.compatibility ?? 0}% Compatibility`}
            />

            <div style={{ marginTop: "20px" }}>
              {chartData && <Radar data={chartData} />}
            </div>

            <h4 style={{ marginTop: "20px" }}>Recommendations:</h4>
            <ul style={{ paddingLeft: "20px" }}>
              {gapData.recommendations?.length ? (
                gapData.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))
              ) : (
                <li>No recommendations 🎉</li>
              )}
            </ul>

            {/* Roadmap Button */}
            <button
              onClick={fetchRoadmap}
              style={{
                marginTop: "20px",
                padding: "12px",
                width: "100%",
                background: "linear-gradient(90deg, #43a047, #1b5e20)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              View Roadmap 🚀
            </button>

            {/* Roadmap Section */}
            {roadmapData && roadmapData.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                {roadmapData.map((step) => (
                  <div
                    key={step.step}
                    style={{
                      marginTop: "10px",
                      padding: "15px",
                      borderRadius: "10px",
                      background: "#ffffff",
                      border: "1px solid #90caf9",
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
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SkillGap;