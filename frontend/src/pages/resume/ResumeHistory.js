import React, { useEffect, useState } from "react";
import { getResumeHistory } from "../../services/api";

function ResumeHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await getResumeHistory();
      setData(res.data);
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Resume History
      </h2>

      <div className="grid gap-4 max-w-4xl mx-auto">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow"
          >
            <p><b>Role:</b> {item.predicted_role}</p>
            <p><b>Score:</b> {item.score}</p>
            <p><b>ATS:</b> {item.ats_score}</p>
            <p><b>Confidence:</b> {item.confidence}</p>
            <p><b>Skills:</b> {item.skills}</p>
            <p className="text-sm text-gray-500">
              {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeHistory;