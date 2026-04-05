import React, { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import DashboardLayout from "../layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

const TestPage = () => {
  const [subjectId, setSubjectId] = useState("");
  const [questionCount, setQuestionCount] = useState(10);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [started, setStarted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(1800);
  const [timerActive, setTimerActive] = useState(false);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showFiveMinWarning, setShowFiveMinWarning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await API.get("/test/subjects");
      setSubjects(res.data);
    };
    fetchSubjects();
  }, []);

  // ================= DISABLE RIGHT CLICK =================
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);
    return () => document.removeEventListener("contextmenu", disableRightClick);
  }, []);

  // ================= PREVENT BACK BUTTON =================
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      alert("Back navigation is disabled during the test.");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ================= SUBMIT =================
  const submitTest = useCallback(
    async (auto = false) => {
      setSubmitting(true);
      setTimerActive(false);

      try {
        await API.post(`/test/submit`, {
          subject_id: subjectId || null,
          answers,
        });

        if (!auto) alert("✅ Test Submitted Successfully!");
        navigate("/dashboard");
      } catch (err) {
        console.error("Submit error:", err);
        alert("❌ Error submitting test. Please try again.");
        setSubmitting(false);
      }
    },
    [subjectId, answers, navigate]
  );

  // ================= TIMER =================
  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft === 300) {
      setShowFiveMinWarning(true);
      setTimeout(() => setShowFiveMinWarning(false), 4000);
    }

    if (timeLeft === 0) {
      alert("⏰ Time is up! Auto submitting...");
      submitTest(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, timerActive, submitTest]);

  // ================= START TEST =================
  const startTest = async () => {
    let url = `/test/random?count=${questionCount}`;
    if (subjectId) url += `&subject_id=${subjectId}`;

    const res = await API.get(url);
    const shuffled = res.data.sort(() => Math.random() - 0.5);
    const initialStatus = {};
    shuffled.forEach((q) => { initialStatus[q.id] = "notVisited"; });

    setQuestions(shuffled);
    setQuestionStatus(initialStatus);
    setStarted(true);
    setTimerActive(true);
    setTimeLeft(questionCount * 60);
  };

  // ================= OPTION SELECT =================
  const selectOption = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
    setQuestionStatus((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === "review" ? "answered_review" : "answered",
    }));
  };

  // ================= CLEAR =================
  const clearResponse = () => {
    const qId = questions[currentQuestion].id;
    const updated = { ...answers };
    delete updated[qId];
    setAnswers(updated);
    setQuestionStatus((prev) => ({ ...prev, [qId]: "visited" }));
  };

  // ================= NEXT =================
  const nextQuestion = () => {
    const qId = questions[currentQuestion].id;
    if (questionStatus[qId] === "notVisited") {
      setQuestionStatus((prev) => ({ ...prev, [qId]: "visited" }));
    }
    if (currentQuestion < questions.length - 1)
      setCurrentQuestion(currentQuestion + 1);
  };

  // ================= PREVIOUS =================
  const previousQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  // ================= STATS =================
  const totalQuestions = questions.length;
  const answeredCount = Object.values(questionStatus).filter(
    (s) => s === "answered" || s === "answered_review"
  ).length;
  const notAnsweredCount = totalQuestions - answeredCount;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const question = questions[currentQuestion];

  return (
    <>
      {!started ? (
        <DashboardLayout>
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Smart Test
                </h1>
                <p className="text-gray-500 mt-2">Challenge yourself and track progress</p>
              </div>

              {/* Settings Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📚 Select Subject (Optional)
                    </label>
                    <select
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                    >
                      <option value="">All Subjects</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📊 Number of Questions
                    </label>
                    <select
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions</option>
                      <option value={25}>25 Questions</option>
                      <option value={30}>30 Questions</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      ⏱️ Time per question: 1 minute
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      📝 Total time: {questionCount} minutes
                    </p>
                  </div>

                  <button
                    onClick={startTest}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-[1.02]"
                  >
                    🚀 Start Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      ) : (
        <DashboardLayout>
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* LEFT - Question Area */}
                <div className="flex-1">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
                      <h2 className="text-white font-bold text-lg">
                        Question {currentQuestion + 1} of {totalQuestions}
                      </h2>
                      <div className={`px-4 py-2 rounded-lg font-bold ${timeLeft <= 300 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-blue-600'}`}>
                        ⏱️ {minutes}:{seconds}
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="p-6">
                      <p className="text-gray-800 text-lg font-medium mb-6">
                        {question?.question_text}
                      </p>

                      <div className="space-y-3">
                        {["A", "B", "C", "D"].map((letter) => {
                          const optionText = question[`option_${letter.toLowerCase()}`];
                          const isSelected = answers[question.id] === letter;

                          return (
                            <button
                              key={letter}
                              onClick={() => selectOption(question.id, letter)}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50 shadow-md"
                                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                              }`}
                            >
                              <span className="font-bold text-gray-700">{letter}.</span>
                              <span className="ml-3 text-gray-700">{optionText}</span>
                              {isSelected && (
                                <span className="float-right text-blue-600">✓ Selected</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={previousQuestion}
                          disabled={currentQuestion === 0}
                          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                            currentQuestion === 0
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-gray-600 text-white hover:bg-gray-700"
                          }`}
                        >
                          ← Previous
                        </button>
                        
                        <button
                          onClick={clearResponse}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
                        >
                          Clear
                        </button>
                        
                        <button
                          onClick={nextQuestion}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          {currentQuestion === totalQuestions - 1 ? "Review" : "Next →"}
                        </button>
                      </div>

                      {/* Submit Button */}
                      <div className="mt-6">
                        <button
                          onClick={() => setShowSubmitModal(true)}
                          disabled={submitting}
                          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                        >
                          📝 Submit Test
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT - Palette */}
                <div className="lg:w-80">
                  <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>🎨</span> Question Palette
                    </h3>
                    
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {questions.map((q, index) => {
                        let bgColor = "bg-gray-200 text-gray-600";
                        if (questionStatus[q.id] === "answered") {
                          bgColor = "bg-green-500 text-white";
                        } else if (questionStatus[q.id] === "visited") {
                          bgColor = "bg-purple-500 text-white";
                        }
                        
                        return (
                          <button
                            key={q.id}
                            onClick={() => setCurrentQuestion(index)}
                            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${bgColor} hover:opacity-80`}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-gray-600">Answered</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span className="text-gray-600">Visited</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <span className="text-gray-600">Not Visited</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="border-t pt-4 mt-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Progress</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {answeredCount}/{totalQuestions}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warnings & Modals */}
          {showFiveMinWarning && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-xl shadow-lg animate-bounce z-50">
              ⚠️ Only 5 minutes remaining! Hurry up!
            </div>
          )}

          {showSubmitModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">📝</div>
                  <h2 className="text-xl font-bold text-gray-800">Confirm Submission</h2>
                  <p className="text-gray-500 text-sm mt-1">Are you sure you want to submit?</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-semibold">{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Answered:</span>
                    <span className="font-semibold text-green-600">{answeredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Not Answered:</span>
                    <span className="font-semibold text-red-600">{notAnsweredCount}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitTest(false)}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </DashboardLayout>
      )}
    </>
  );
};

export default TestPage;