import React from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
function CareerResult() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
    <div>
      <h2>Recommended Career</h2>
      <p>AI Engineer</p>
=======
import { useLocation, useNavigate } from "react-router-dom";

const CareerResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;
>>>>>>> 91f0a3cfa240004c9a94ee90fac2e97b71d53416

  if (!data || !data.top_careers || data.top_careers.length === 0) {
    return <h2>No Data Found</h2>;
  }

  const handleViewRoadmap = (career) => {
    // Pass only the clicked career to roadmap
    navigate("/roadmap", { state: { careers: [career] } });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Top Career Recommendations</h2>

      {data.top_careers.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            margin: "10px 0",
            borderRadius: "10px",
          }}
        >
          <h3>{item.career}</h3>
          <p>Match Score: {item.score}%</p>

          <button
            onClick={() => handleViewRoadmap(item)}
            style={{
              marginTop: "10px",
              padding: "6px 12px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            View Roadmap
          </button>
        </div>
      ))}
    </div>
    </DashboardLayout>
  );
};

export default CareerResult;