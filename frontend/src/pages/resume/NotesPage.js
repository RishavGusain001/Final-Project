import React, { useState } from "react";
import API from "../../services/api";

function NotesPage() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateNotes = async () => {
    // Clear previous
    setError("");
    setNotes("");
    
    // Validate
    if (!subject.trim()) {
      setError("Please enter a subject");
      return;
    }
    
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Sending:", { subject, topic });
      
      const response = await API.post("/practice/generate-notes", {
        subject: subject,
        topic: topic
      });
      
      console.log("Response:", response.data);
      
      if (response.data.notes) {
        setNotes(response.data.notes);
      } else {
        setError("No notes received");
      }
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        setError(`Server Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        setError("Cannot connect to server. Make sure backend is running on port 8000");
      } else {
        setError(`Error: ${err.message}`);
      }
    }
    
    setLoading(false);
  };

  const downloadPDF = async () => {
    if (!notes) {
      setError("Generate notes first!");
      return;
    }
    
    try {
      const response = await API.post(
        "/practice/download-pdf",
        {
          subject: subject,
          topic: topic,
          notes: notes
        },
        {
          responseType: "blob"
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${subject}_${topic}_Notes.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Error downloading PDF");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <h1 style={{ textAlign: "center", color: "#667eea", marginBottom: "30px", fontSize: "2em" }}>
          📘 AI Notes Generator
        </h1>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Subject:</label>
          <input
            type="text"
            placeholder="e.g., Python, JavaScript, Data Structures"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ width: "100%", padding: "12px", border: "2px solid #e0e0e0", borderRadius: "10px", fontSize: "16px" }}
          />
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Topic:</label>
          <input
            type="text"
            placeholder="e.g., Sorting Algorithms, Recursion, OOP"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ width: "100%", padding: "12px", border: "2px solid #e0e0e0", borderRadius: "10px", fontSize: "16px" }}
          />
        </div>
        
        <button
          onClick={generateNotes}
          disabled={loading}
          style={{ width: "100%", padding: "14px", background: "#667eea", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginBottom: "20px" }}
        >
          {loading ? "⏳ Generating..." : "✨ Generate Notes"}
        </button>
        
        {error && (
          <div style={{ padding: "12px", background: "#fee", border: "1px solid #fcc", borderRadius: "10px", color: "#c33", marginBottom: "20px" }}>
            ⚠️ {error}
          </div>
        )}
        
        {notes && (
          <>
            <div style={{ background: "#f5f5f5", padding: "20px", borderRadius: "10px", marginBottom: "20px", whiteSpace: "pre-line" }}>
              {notes}
            </div>
            
            <button
              onClick={downloadPDF}
              style={{ width: "100%", padding: "12px", background: "#4caf50", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", cursor: "pointer" }}
            >
              📥 Download PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default NotesPage;