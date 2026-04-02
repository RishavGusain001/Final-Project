import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
function CareerResult() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
    <div>
      <h2>Recommended Career</h2>
      <p>AI Engineer</p>

      <button onClick={() => navigate("/skill-gap")}>
        Check Skill Gap
      </button>
    </div>
    </DashboardLayout>
  );
}

export default CareerResult;