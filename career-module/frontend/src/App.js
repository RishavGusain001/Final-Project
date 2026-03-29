import React, { useState } from "react";

function App() {
  const [skills, setSkills] = useState("");
  const [interest, setInterest] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary logic (we'll replace with ML later)
    let career = "";

    if (skills.includes("Python") && interest === "AI") {
      career = "Data Scientist";
    } else if (skills.includes("HTML") && interest === "Web Development") {
      career = "Frontend Developer";
    } else {
      career = "Software Developer";
    }

    setResult(career);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Career Recommendation System</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          style={{ padding: "10px", width: "300px", margin: "10px" }}
        />

        <br />

        <select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          style={{ padding: "10px", width: "320px", margin: "10px" }}
        >
          <option value="">Select Interest</option>
          <option value="AI">AI</option>
          <option value="Web Development">Web Development</option>
          <option value="Data Science">Data Science</option>
        </select>

        <br />

        <button type="submit" style={{ padding: "10px 20px" }}>
          Get Career Recommendation
        </button>
      </form>

      {/* RESULT DISPLAY */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Recommended Career:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;