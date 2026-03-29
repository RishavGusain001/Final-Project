import React, { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import DashboardLayout from "../layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

const TestPage = () => {
  const [subjectId, setSubjectId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [started, setStarted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(1800);
  const [timerActive, setTimerActive] = useState(false);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showFiveMinWarning, setShowFiveMinWarning] = useState(false);

  const navigate = useNavigate();

  // ================= DISABLE RIGHT CLICK =================
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);
    return () =>
      document.removeEventListener("contextmenu", disableRightClick);
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

  // ================= TIMER =================
  const submitTest = useCallback(
    async (auto = false) => {
      setTimerActive(false);

      await API.post(
        `/test/submit?subject_id=${subjectId}`,
        answers,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!auto) alert("Test Submitted Successfully");
      navigate("/dashboard");
    },
    [subjectId, answers, navigate]
  );

  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft === 300) {
      setShowFiveMinWarning(true);
      setTimeout(() => setShowFiveMinWarning(false), 4000);
    }

    if (timeLeft === 0) {
      alert("Time is up! Auto submitting...");
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
    if (!subjectId) return alert("Select subject");

    const res = await API.get(`/test/questions/${subjectId}`);

    const initialStatus = {};
    res.data.forEach((q) => {
      initialStatus[q.id] = "notVisited";
    });

    setQuestions(res.data);
    setQuestionStatus(initialStatus);
    setStarted(true);
    setTimerActive(true);
    setTimeLeft(1800);
  };

  // ================= OPTION SELECT =================
  const selectOption = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });

    setQuestionStatus((prev) => ({
      ...prev,
      [questionId]:
        prev[questionId] === "review"
          ? "answered_review"
          : "answered",
    }));
  };

  // ================= CLEAR RESPONSE =================
  const clearResponse = () => {
    const qId = questions[currentQuestion].id;

    const updated = { ...answers };
    delete updated[qId];
    setAnswers(updated);

    setQuestionStatus((prev) => ({
      ...prev,
      [qId]: "visited",
    }));
  };

  // ================= SAVE & NEXT =================
  const nextQuestion = () => {
    const qId = questions[currentQuestion].id;

    if (questionStatus[qId] === "notVisited") {
      setQuestionStatus((prev) => ({
        ...prev,
        [qId]: "visited",
      }));
    }

    if (currentQuestion < questions.length - 1)
      setCurrentQuestion(currentQuestion + 1);
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
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Start Test</h2>

          <select
            className="w-full p-2 border rounded mb-4"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">Select Subject</option>
            <option value="1">Math</option>
            <option value="2">English</option>
          </select>

          <button
            onClick={startTest}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Start (30 Minutes)
          </button>
        </div>
        </DashboardLayout>
      ) : (
        <div className="flex gap-6">

          {/* LEFT SIDE */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow">

            <div className="flex justify-between mb-4">
              <h2>Question {currentQuestion + 1}</h2>
              <div className="bg-red-100 text-red-600 px-3 py-1 rounded">
                {minutes}:{seconds}
              </div>
            </div>

            <p className="mb-4">{question?.question_text}</p>

            {["A", "B", "C", "D"].map((letter) => {
              const optionText =
                question[`option_${letter.toLowerCase()}`];

              return (
                <button
                  key={letter}
                  onClick={() =>
                    selectOption(question.id, letter)
                  }
                  className={`w-full text-left p-3 mb-2 border rounded ${
                    answers[question.id] === letter
                      ? "bg-blue-100 border-blue-500"
                      : ""
                  }`}
                >
                  {letter}. {optionText}
                </button>
              );
            })}

            <div className="flex gap-3 mt-4">
              <button
                onClick={clearResponse}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Clear Response
              </button>

              <button
                onClick={nextQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save & Next
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-green-600 text-white px-6 py-2 rounded"
              >
                Submit Test
              </button>
            </div>
          </div>

          {/* RIGHT SIDE PALETTE */}
          <div className="w-64 bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Question Palette</h3>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-9 h-9 rounded text-sm ${
                    questionStatus[q.id] === "answered"
                      ? "bg-green-500 text-white"
                      : questionStatus[q.id] === "visited"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-5 text-sm space-y-1">
              <p><span className="inline-block w-3 h-3 bg-green-500 mr-2"></span>Answered</p>
              <p><span className="inline-block w-3 h-3 bg-red-400 mr-2"></span>Visited</p>
              <p><span className="inline-block w-3 h-3 bg-gray-300 mr-2"></span>Not Visited</p>
            </div>
          </div>
        </div>
      )}

      {/* 5 MIN WARNING */}
      {showFiveMinWarning && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded shadow-lg z-50">
          ⚠ Only 5 minutes remaining!
        </div>
      )}

      {/* SUBMIT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              Confirm Submission
            </h2>

            <p>Total Questions: {totalQuestions}</p>
            <p>Answered: {answeredCount}</p>
            <p>Not Answered: {notAnsweredCount}</p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => submitTest(false)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestPage;