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
    subject_name: "",      // Changed from subject id to subject name
    topic_name: "",        // Changed from topic id to topic name
    difficulty: "easy",
  });

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  // 🔐 Check admin access
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Access denied");
      navigate("/dashboard");
    }
  }, [navigate]);

  // Fetch subjects and topics for suggestions
  useEffect(() => {
    fetchSubjects();
    fetchTopics();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await API.get("/test/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await API.get("/test/topics");
      setTopics(res.data);
    } catch (err) {
      console.error("Error fetching topics:", err);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // Clear message when user starts typing
    if (message) setMessage("");
  };

  // Filter topics based on subject name
  const getFilteredTopics = () => {
    if (!form.subject_name) return [];
    const selectedSubject = subjects.find(s => s.name === form.subject_name);
    if (!selectedSubject) return [];
    return topics.filter(t => t.subject_id === selectedSubject.id);
  };

  // Validate form
  const validateForm = () => {
    if (!form.question_text.trim()) {
      setMessage("❌ Please enter the question");
      setMessageType("error");
      return false;
    }
    if (!form.option_a.trim()) {
      setMessage("❌ Please enter Option A");
      setMessageType("error");
      return false;
    }
    if (!form.option_b.trim()) {
      setMessage("❌ Please enter Option B");
      setMessageType("error");
      return false;
    }
    if (!form.option_c.trim()) {
      setMessage("❌ Please enter Option C");
      setMessageType("error");
      return false;
    }
    if (!form.option_d.trim()) {
      setMessage("❌ Please enter Option D");
      setMessageType("error");
      return false;
    }
    if (!form.correct_option) {
      setMessage("❌ Please select the correct option");
      setMessageType("error");
      return false;
    }
    if (!form.subject_name.trim()) {
      setMessage("❌ Please enter a subject name");
      setMessageType("error");
      return false;
    }
    if (!form.topic_name.trim()) {
      setMessage("❌ Please enter a topic name");
      setMessageType("error");
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Send subject_name and topic_name directly
      await API.post("/admin/add-question", null, {
        params: {
          question_text: form.question_text,
          option_a: form.option_a,
          option_b: form.option_b,
          option_c: form.option_c,
          option_d: form.option_d,
          correct_option: form.correct_option,
          subject_id: form.subject_id.trim(),
          topic: form.topic.trim(),
          difficulty: form.difficulty,
        },
      });

      setMessage("✅ Question added successfully!");
      setMessageType("success");

      // Reset form
      setForm({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "",
        subject_id: "",
        topic: "",
        difficulty: "easy",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error adding question. Please try again.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all fields?")) {
      setForm({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "",
        subject_id: "",
        topic: "",
        difficulty: "easy",
      });
      setMessage("");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg mb-4">
              <span className="text-3xl">➕</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Add New Question
            </h1>
            <p className="text-gray-500 mt-2">Create practice questions for students</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-white font-bold text-xl">📝 Question Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📖 Question Text
                </label>
                <textarea
                  name="question_text"
                  placeholder="Enter your question here..."
                  value={form.question_text}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition resize-none"
                />
              </div>

              {/* Options Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    A. Option A
                  </label>
                  <input
                    type="text"
                    name="option_a"
                    placeholder="Enter option A"
                    value={form.option_a}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    B. Option B
                  </label>
                  <input
                    type="text"
                    name="option_b"
                    placeholder="Enter option B"
                    value={form.option_b}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    C. Option C
                  </label>
                  <input
                    type="text"
                    name="option_c"
                    placeholder="Enter option C"
                    value={form.option_c}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    D. Option D
                  </label>
                  <input
                    type="text"
                    name="option_d"
                    placeholder="Enter option D"
                    value={form.option_d}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Correct Option */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ✅ Correct Option
                </label>
                <select
                  name="correct_option"
                  value={form.correct_option}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                >
                  <option value="">Select correct option</option>
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              {/* Subject Name - Direct Text Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📚 Subject Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="subject_name"
                    placeholder="Enter subject name (e.g., Mathematics, Physics)"
                    value={form.subject_name}
                    onChange={handleChange}
                    onFocus={() => setShowSubjectDropdown(true)}
                    onBlur={() => setTimeout(() => setShowSubjectDropdown(false), 200)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                    autoComplete="off"
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSubjectDropdown && subjects.length > 0 && form.subject_name && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {subjects
                        .filter(s => s.name.toLowerCase().includes(form.subject_name.toLowerCase()))
                        .map(subject => (
                          <div
                            key={subject.id}
                            className="px-4 py-2 hover:bg-green-50 cursor-pointer transition"
                            onClick={() => {
                              setForm({ ...form, subject_name: subject.name });
                              setShowSubjectDropdown(false);
                            }}
                          >
                            {subject.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  💡 You can enter any subject name (new or existing)
                </p>
              </div>

              {/* Topic Name - Direct Text Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🎯 Topic Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="topic_name"
                    placeholder="Enter topic name (e.g., Algebra, Kinematics)"
                    value={form.topic_name}
                    onChange={handleChange}
                    onFocus={() => setShowTopicDropdown(true)}
                    onBlur={() => setTimeout(() => setShowTopicDropdown(false), 200)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                    autoComplete="off"
                  />
                  
                  {/* Suggestions Dropdown for Topics based on Subject */}
                  {showTopicDropdown && form.subject_name && getFilteredTopics().length > 0 && form.topic_name && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {getFilteredTopics()
                        .filter(t => t.name.toLowerCase().includes(form.topic_name.toLowerCase()))
                        .map(topic => (
                          <div
                            key={topic.id}
                            className="px-4 py-2 hover:bg-green-50 cursor-pointer transition"
                            onClick={() => {
                              setForm({ ...form, topic_name: topic.name });
                              setShowTopicDropdown(false);
                            }}
                          >
                            {topic.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Topics are auto-suggested based on the subject name entered
                </p>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📊 Difficulty Level
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value="easy"
                      checked={form.difficulty === "easy"}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="text-green-600">🟢 Easy</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value="medium"
                      checked={form.difficulty === "medium"}
                      onChange={handleChange}
                      className="w-4 h-4 text-yellow-600"
                    />
                    <span className="text-yellow-600">🟡 Medium</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value="hard"
                      checked={form.difficulty === "hard"}
                      onChange={handleChange}
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-red-600">🔴 Hard</span>
                  </label>
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`p-3 rounded-lg flex items-center gap-2 ${
                  messageType === "success" 
                    ? "bg-green-50 border border-green-200 text-green-700" 
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}>
                  <span>{messageType === "success" ? "✅" : "⚠️"}</span>
                  <span>{message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Adding Question...
                    </span>
                  ) : (
                    "➕ Add Question"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Quick Tips */}
          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <span>💡</span> Quick Tips
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Make sure all options are unique and clear</li>
              <li>• The correct option should match exactly with one of the options</li>
              <li>• You can enter any subject name (existing subjects will be suggested)</li>
              <li>• Topics are linked to subjects - suggestions appear after entering subject</li>
              <li>• New subjects and topics will be automatically created in the database</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default AddQuestionPage;