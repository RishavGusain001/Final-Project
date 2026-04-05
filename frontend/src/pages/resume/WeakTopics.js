import React, { useEffect, useState } from "react";
import API from "../../services/api";

function WeakTopics() {
  const [topics, setTopics] = useState([]);

  const user_id = 1;

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    const res = await API.get(`/practice/weak-topics?user_id=${user_id}`);
    setTopics(res.data);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">⚠️ Weak Topics</h2>

      {topics.map((t, i) => (
        <div key={i} className="border p-3 mb-2 rounded">
          <p className="font-semibold">{t.topic}</p>
          <p className="text-sm text-gray-600">
            Wrong: {t.wrong} | Correct: {t.correct}
          </p>
        </div>
      ))}
    </div>
  );
}

export default WeakTopics;