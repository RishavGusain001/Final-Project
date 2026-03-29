import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";

const AddQuestionPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "",
    subject: "",
    difficulty: "easy",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔐 Check admin access
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Access denied");
      navigate("/dashboard");
    }
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Validation
    if (
      !form.question_text ||
      !form.option_a ||
      !form.option_b ||
      !form.option_c ||
      !form.option_d ||
      !form.correct_option ||
      !form.subject
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/admin/add-question", null, {
        params: form, // 🔥 sending as query params
      });

      setMessage("✅ Question added successfully!");

      // Reset form
      setForm({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "",
        subject: "",
        difficulty: "easy",
      });

    } catch (err) {
      console.error(err);
      alert("Error adding question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-10">
      
      <h2 className="text-2xl font-bold mb-6 text-center">
        ➕ Add New Question
      </h2>

      {message && (
        <p className="text-green-600 text-center mb-4">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Question */}
        <textarea
          name="question_text"
          placeholder="Enter Question"
          value={form.question_text}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        {/* Options */}
        <input
          type="text"
          name="option_a"
          placeholder="Option A"
          value={form.option_a}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="text"
          name="option_b"
          placeholder="Option B"
          value={form.option_b}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="text"
          name="option_c"
          placeholder="Option C"
          value={form.option_c}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="text"
          name="option_d"
          placeholder="Option D"
          value={form.option_d}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        {/* Correct Option */}
        <select
          name="correct_option"
          value={form.correct_option}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">Select Correct Option</option>
          <option value="A">Option A</option>
          <option value="B">Option B</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>

        {/* Subject */}
        <input
          type="text"
          name="subject"
          placeholder="Subject (e.g. OS, DBMS)"
          value={form.subject}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        {/* Difficulty */}
        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Question"}
        </button>

      </form>
    </div>
    </DashboardLayout>
  );
};

export default AddQuestionPage;