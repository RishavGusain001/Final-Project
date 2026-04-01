import React from "react";
import { useNavigate } from "react-router-dom";

function SkillGap() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Skill Gap</h2>
      <p>Missing: Python, ML</p>
      <p>Gap: 40%</p>

      <button onClick={() => navigate("/roadmap")}>
        View Roadmap
      </button>
    </div>
  );
}

export default SkillGap;