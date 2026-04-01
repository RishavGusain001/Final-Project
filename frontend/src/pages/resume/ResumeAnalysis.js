import React, { useEffect, useState } from "react";

function ResumeAnalysis() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("resumeData");
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  if (!data) {
    return <h2 className="text-center mt-10">No Data Found</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Resume Analysis Result
        </h2>

        {/* Score */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">Score</h3>
          <p className="text-4xl text-blue-600 font-bold">{data.score}/100</p>
        </div>

        {/* Skills Found */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Skills Found</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills_found.map((skill, index) => (
              <span
                key={index}
                className="bg-green-200 text-green-800 px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.missing_skills.map((skill, index) => (
              <span
                key={index}
                className="bg-red-200 text-red-800 px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
          <ul className="list-disc pl-5">
            {data.suggestions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalysis;