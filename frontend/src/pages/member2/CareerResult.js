import React from "react";
import { useNavigate } from "react-router-dom";

function CareerResult() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Recommended Career</h2>
      <p>AI Engineer</p>

      <button onClick={() => navigate("/skill-gap")}>
        Check Skill Gap
      </button>
    </div>
  );
}

export default CareerResult;