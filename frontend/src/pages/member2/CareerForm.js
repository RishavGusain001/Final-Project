import React from "react";
import { useNavigate } from "react-router-dom";

function CareerForm() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Career Recommendation</h2>

      <input placeholder="Enter skills" />
      <input placeholder="Enter interests" />

      <button onClick={() => navigate("/career-result")}>
        Get Career
      </button>
    </div>
  );
}

export default CareerForm;