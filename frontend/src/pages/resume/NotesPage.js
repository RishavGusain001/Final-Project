import React, { useState } from "react";
import API from "../../services/api";

function NotesPage() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateNotes = async () => {
    if (!subject || !topic) {
      alert("Enter subject and topic");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/practice/generate-notes", {
        subject,
        topic,
      });

      setNotes(res.data.notes);
      setImage(res.data.image_url);
    } catch (err) {
      alert("Error generating notes");
    }

    setLoading(false);
  };

  const downloadPDF = async () => {
    try {
      const res = await API.post(
        "/practice/download-pdf",
        { subject, topic, notes },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Notes.pdf");
      document.body.appendChild(link);
      link.click();
    } catch {
      alert("Error downloading PDF");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          📘 AI Smart Notes
        </h2>

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 mb-3 border rounded-lg"
        />

        <input
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg"
        />

        <button
          onClick={generateNotes}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {loading ? "Generating..." : "Generate Notes"}
        </button>

        {notes && (
          <>
            <div className="mt-6 bg-blue-50 p-6 rounded-xl whitespace-pre-line font-sans font-bold text-base text-blue-900">
              {notes}
            </div>
          </>
        )}

        {image && (
          <div className="mt-6">
            <p className="text-blue-600 font-semibold mb-2">
              📊 Related Diagram
            </p>
            <img
              src={image}
              alt="diagram"
              className="w-full max-h-80 object-contain bg-white p-4 rounded-xl border shadow"
            />
            <button
              onClick={downloadPDF}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
            >
              📄 Download PDF
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default NotesPage;