import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";

function SkillGap() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
    <div>
      <h2>Skill Gap</h2>
      <p>Missing: Python, ML</p>
      <p>Gap: 40%</p>

      <button onClick={() => navigate("/roadmap")}>
        View Roadmap
      </button>
    </div>
    </DashboardLayout>
  );
}

export default SkillGap;