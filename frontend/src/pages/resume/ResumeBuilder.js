import React, { useState } from "react";
import API from "../../services/api";

function ResumeBuilder() {
  const [template, setTemplate] = useState("ats");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    summary: "",
    skills: "",
    education: "",
    experience: "",
    projects: "",
    certifications: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDownload = async () => {
    await API.post("/resume/generate-pdf", {
      ...form,
      template
    });
    alert("Resume Downloaded!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

      {/* LEFT FORM */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">🧾 Resume Builder</h2>

        {/* TEMPLATE SELECT */}
        <select
          onChange={(e) => setTemplate(e.target.value)}
          className="input mb-4"
        >
          <option value="ats">ATS Template</option>
          <option value="modern">Modern Template</option>
        </select>

        {/* INPUTS */}
        {Object.keys(form).map((key) => (
          key === "summary" ||
          key === "skills" ||
          key === "education" ||
          key === "experience" ||
          key === "projects" ||
          key === "certifications" ? (
            <textarea
              key={key}
              name={key}
              placeholder={key}
              onChange={handleChange}
              className="input mb-3"
            />
          ) : (
            <input
              key={key}
              name={key}
              placeholder={key}
              onChange={handleChange}
              className="input mb-3"
            />
          )
        ))}

        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white w-full py-2 rounded-lg mt-4"
        >
          📥 Download Resume
        </button>
      </div>

      {/* RIGHT PREVIEW */}
      <div className="bg-gray-50 p-4 rounded-xl shadow overflow-auto h-[90vh]">

        {template === "ats" ? (
          <ATSPreview form={form} />
        ) : (
          <ModernPreview form={form} />
        )}

      </div>
    </div>
  );
}

export default ResumeBuilder;

function ATSPreview({ form }) {
  return (
    <div className="bg-white p-6 text-black">
      <h1 className="text-2xl font-bold">{form.name}</h1>
      <p className="text-sm">{form.email} | {form.phone}</p>

      <Section title="Summary" content={form.summary} />
      <Section title="Skills" content={form.skills} />
      <Section title="Education" content={form.education} />
      <Section title="Experience" content={form.experience} />
      <Section title="Projects" content={form.projects} />
      <Section title="Certifications" content={form.certifications} />
    </div>
  );
}

function ModernPreview({ form }) {
  return (
    <div className="bg-white p-6">
      <div className="border-b pb-4 mb-4">
        <h1 className="text-3xl font-bold text-blue-600">{form.name}</h1>
        <p>{form.email} | {form.phone}</p>
      </div>

      <Section title="Summary" content={form.summary} />
      <Section title="Skills" content={form.skills} />
      <Section title="Experience" content={form.experience} />
      <Section title="Projects" content={form.projects} />
    </div>
  );
}

function Section({ title, content }) {
  if (!content) return null;

  return (
    <div className="mb-4">
      <h3 className="font-bold border-b mb-1">{title}</h3>
      <p className="text-sm whitespace-pre-line">{content}</p>
    </div>
  );
}