import React, { useState } from "react";
import { uploadResume } from "../../services/api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume file");
      return;
    }

    setLoading(true);

    try {
      const res = await uploadResume(file);

      // Save result temporarily
      localStorage.setItem("resumeData", JSON.stringify(res.data));

      navigate("/resume/result");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[400px] text-center">
        <h2 className="text-2xl font-bold mb-6">Upload Resume</h2>

        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 w-full border p-2 rounded"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
        >
          {loading ? "Uploading..." : "Upload & Analyze"}
        </button>
      </div>
    </div>
    </DashboardLayout>
  );
}

export default ResumeUpload;