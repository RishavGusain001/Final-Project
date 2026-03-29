import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const TestHistoryPage = () => {
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const res = await API.get("/test/performance");
      console.log("Attempts:", res.data); // 🔥 DEBUG
      setAttempts(res.data || []);
    } catch (err) {
      console.error("Error fetching attempts:", err);
    }
  };

  const handleViewAnalysis = (id) => {
    if (!id) {
      alert("Invalid attempt ID");
      return;
    }

    console.log("Navigating to:", id); // 🔥 DEBUG
    navigate(`/analysis/${id}`);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📄 Test History</h2>

      {attempts.length === 0 ? (
        <p>No test attempts yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th>Date</th>
              <th>Subject</th>
              <th>Score</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {attempts.map((a) => (
              <tr
                key={a.id}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <td>
                  {a.attempted_at
                    ? new Date(a.attempted_at).toLocaleDateString()
                    : "N/A"}
                </td>

                <td>{a.subject || "N/A"}</td>

                <td>
                  {a.score ?? 0} / {a.total_questions ?? 0}
                </td>

                <td>
                  <button
                    onClick={() => handleViewAnalysis(a.id)}
                    style={{
                      padding: "5px 10px",
                      background: "#6366f1",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    View Analysis
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TestHistoryPage;