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
        .get(`http://127.0.0.1:8000/career/roadmap/${encodeURIComponent(selectedCareer)}`)
        .then((res) => setRoadmap(res.data))
        .catch((err) => console.error("Error fetching roadmap:", err));
    }
  }, [selectedCareer]);

  return (
    <DashboardLayout>
      <div style={{ padding: "20px" }}>
        <h2>Choose a Career Roadmap 🚀</h2>

        {/* Dropdown */}
        <select
          value={selectedCareer}
          onChange={(e) => setSelectedCareer(e.target.value)}
          style={{
            padding: "10px",
            marginTop: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
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
          <div style={{ marginTop: "20px" }}>No Roadmap Found</div>
        )}

        {roadmap.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>{selectedCareer} Roadmap</h3>
            {roadmap.map((step) => (
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
      </div>
    </DashboardLayout>
  );
};

export default Roadmap;
