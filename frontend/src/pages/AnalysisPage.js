import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../layout/DashboardLayout";

const AnalysisPage = () => {
  const { id } = useParams(); 
  const [attempts, setAttempts] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showWrongOnly, setShowWrongOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Load Attempts
  // -------------------------
  const loadAttempts = useCallback(async () => {
    try {
      const res = await API.get("/test/performance");
      setAttempts(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadAttempts();
  }, [loadAttempts]);

  // -------------------------
  // Set attempt from URL
  // -------------------------
  useEffect(() => {
    if (id) {
      setSelectedAttempt(id);
    }
  }, [id]);

  // -------------------------
  // Load Analysis
  // -------------------------
  const loadAnalysis = useCallback(async () => {
    if (!selectedAttempt) return;

    try {
      setLoading(true);
      const res = await API.get(`/test/analysis/${selectedAttempt}`);
      setAnalysis(res.data);
      setCurrentQuestion(0);
    } catch (err) {
      console.error(err);
      alert("Error loading analysis");
    } finally {
      setLoading(false);
    }
  }, [selectedAttempt]);

  useEffect(() => {
    loadAnalysis();
  }, [loadAnalysis]);

  // -------------------------
  // Filtering Logic
  // -------------------------
  const filteredQuestions = showWrongOnly
    ? analysis.filter((q) => !q.is_correct)
    : analysis;

  const question = filteredQuestions?.[currentQuestion];

  // -------------------------
  // Summary Calculation
  // -------------------------
  const total = analysis.length;
  const correct = analysis.filter((q) => q.is_correct).length;
  const wrong = total - correct;
  const accuracy = total ? ((correct / total) * 100).toFixed(1) : 0;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md">

        <h2 className="text-2xl font-bold mb-6">📊 Test Analysis</h2>

        {/* Attempt Selector */}
        <div className="flex gap-4 mb-6">
          <select
            className="flex-1 p-3 border rounded-lg"
            value={selectedAttempt}
            onChange={(e) => setSelectedAttempt(e.target.value)}
          >
            <option value="">Select Attempt</option>
            {attempts.map((a) => (
              <option key={a.id} value={a.id}>
                Attempt #{a.id} — {a.score}/{a.total_questions}
              </option>
            ))}
          </select>

          <button
            onClick={loadAnalysis}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Load
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {/* No Data */}
        {!loading && analysis.length === 0 && (
          <p className="text-gray-500">No analysis available.</p>
        )}

        {/* MAIN CONTENT */}
        {analysis.length > 0 && (
          <>
            {/* 🔥 Summary Panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
              <div className="bg-gray-100 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold text-lg">{total}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Correct</p>
                <p className="font-bold text-lg text-green-700">{correct}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Wrong</p>
                <p className="font-bold text-lg text-red-700">{wrong}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Accuracy</p>
                <p className="font-bold text-lg text-blue-700">{accuracy}%</p>
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => {
                setShowWrongOnly(!showWrongOnly);
                setCurrentQuestion(0);
              }}
              className="mb-6 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              {showWrongOnly ? "Show All Questions" : "Show Only Wrong Answers"}
            </button>

            {/* Question Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filteredQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-9 h-9 rounded-full font-semibold ${
                    currentQuestion === index
                      ? "bg-blue-600 text-white"
                      : q.is_correct
                      ? "bg-green-200"
                      : "bg-red-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Question Display */}
            {question ? (
              <div className="p-5 border rounded-xl bg-gray-50">

                <h3 className="text-lg font-semibold mb-4">
                  Q{currentQuestion + 1}. {question.question_text}
                </h3>

                {["A", "B", "C", "D"].map((letter) => {
                  const optionText = question[`option_${letter.toLowerCase()}`];

                  let style =
                    "p-3 rounded-lg border mb-3 transition font-medium";

                  if (letter === question.correct_option) {
                    style += " bg-green-200 border-green-600";
                  }

                  if (
                    letter === question.selected_option &&
                    !question.is_correct
                  ) {
                    style += " bg-red-200 border-red-600";
                  }

                  return (
                    <div key={letter} className={style}>
                      <strong>{letter}.</strong> {optionText}
                    </div>
                  );
                })}

                {/* Answer Info */}
                <div className="mt-4 text-sm text-gray-600">
                  Your Answer:{" "}
                  <strong>{question.selected_option}</strong> | Correct Answer:{" "}
                  <strong>{question.correct_option}</strong>
                </div>

              </div>
            ) : (
              <p className="text-gray-500">No question available.</p>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalysisPage;