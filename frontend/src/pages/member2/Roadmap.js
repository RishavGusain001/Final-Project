import React from "react";
import { useLocation } from "react-router-dom";

const Roadmap = () => {
  const location = useLocation();

  // ✅ GET ALL CAREERS
  const careers =
    location.state?.careers ||
    JSON.parse(localStorage.getItem("allCareers")) ||
    [];

  if (careers.length === 0) return <div>No Data Found</div>;

  // 🔥 ROADMAP DATA
  const roadmapData = {
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React"],
    "Backend Developer": ["Java/Python", "APIs", "Database"],
    "AI Engineer": ["Python", "ML", "Deep Learning"],
    "Machine Learning Engineer": ["Python", "ML Algorithms", "Deployment"],
    "Data Scientist": ["Python", "Statistics", "ML"],
    "Data Analyst": ["SQL", "Excel", "Power BI"],
    "UI/UX Designer": ["Figma", "Wireframing", "User Research"],
    "DevOps Engineer": ["Linux", "Docker", "CI/CD"],
    "Software Engineer": ["DSA", "Projects", "System Design"]
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Career Roadmaps 🚀</h2>

      {careers.map((item, index) => {
        const steps = roadmapData[item.career] || ["Learn basics", "Build projects"];

        return (
          <div
            key={index}
            style={{
              marginTop: "20px",
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "10px",
              background: "#f9f9f9"
            }}
          >
            <h3>{item.career}</h3>
            <p>Match Score: {item.score}%</p>

            <ul>
              {steps.map((step, i) => (
                <li key={i}>
                  {i + 1}. {step}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Roadmap;