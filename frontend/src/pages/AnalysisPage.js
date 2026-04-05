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

  const getScoreColor = (value, type) => {
    if (type === 'accuracy') {
      if (value >= 70) return "text-green-600";
      if (value >= 50) return "text-yellow-600";
      return "text-red-600";
    }
    return "";
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              📊 Test Analysis
            </h1>
            <p className="text-gray-600">
              Review your answers and track your performance
            </p>
          </div>

          {/* Attempt Selector Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Test Attempt
            </label>
            <div className="flex gap-4">
              <select
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedAttempt}
                onChange={(e) => setSelectedAttempt(e.target.value)}
              >
                <option value="">Choose a test attempt...</option>
                {attempts.map((a) => (
                  <option key={a.id} value={a.id}>
                    #{a.id} - {a.subject || "Mixed"} - {a.score}/{a.total_questions} ({a.attempted_at ? new Date(a.attempted_at).toLocaleDateString() : 'N/A'})
                  </option>
                ))}
              </select>

              <button
                onClick={loadAnalysis}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Load
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading analysis...</p>
            </div>
          )}

          {/* No Data State */}
          {!loading && analysis.length === 0 && selectedAttempt && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No analysis available
              </h3>
              <p className="text-gray-500">
                No data found for this test attempt
              </p>
            </div>
          )}

          {/* No Selection State */}
          {!loading && analysis.length === 0 && !selectedAttempt && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a test to analyze
              </h3>
              <p className="text-gray-500">
                Choose a test attempt from the dropdown above
              </p>
            </div>
          )}

          {/* MAIN CONTENT */}
          {analysis.length > 0 && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100">
                  <div className="text-2xl mb-2">📝</div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{total}</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100">
                  <div className="text-2xl mb-2">✅</div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Correct</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{correct}</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100">
                  <div className="text-2xl mb-2">❌</div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Wrong</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{wrong}</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Accuracy</p>
                  <p className={`text-2xl font-bold mt-1 ${getScoreColor(accuracy, 'accuracy')}`}>
                    {accuracy}%
                  </p>
                </div>
              </div>

              {/* Filter Button */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    setShowWrongOnly(!showWrongOnly);
                    setCurrentQuestion(0);
                  }}
                  className={`px-5 py-2 rounded-lg font-medium transition shadow-sm ${
                    showWrongOnly 
                      ? "bg-gray-600 text-white hover:bg-gray-700" 
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {showWrongOnly ? "📋 Show All Questions" : "⚠️ Show Only Wrong Answers"}
                </button>
                {showWrongOnly && (
                  <span className="ml-3 text-sm text-gray-500">
                    Showing {filteredQuestions.length} wrong answers
                  </span>
                )}
              </div>

              {/* Question Navigation */}
              {filteredQuestions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Question Navigation
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {filteredQuestions.map((q, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        className={`w-9 h-9 rounded-full font-semibold text-sm transition-all ${
                          currentQuestion === index
                            ? "bg-blue-600 text-white ring-2 ring-blue-300"
                            : q.is_correct
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Display */}
              {question ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <h3 className="text-white font-semibold text-lg">
                      Question {currentQuestion + 1} of {filteredQuestions.length}
                    </h3>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-800 text-lg font-medium mb-6">
                      {question.question_text}
                    </p>

                    <div className="space-y-3 mb-6">
                      {["A", "B", "C", "D"].map((letter) => {
                        const optionText = question[`option_${letter.toLowerCase()}`];
                        
                        let bgColor = "bg-gray-50 border-gray-200";
                        let borderColor = "border-gray-200";
                        
                        if (letter === question.correct_option) {
                          bgColor = "bg-green-50";
                          borderColor = "border-green-500";
                        }
                        
                        if (letter === question.selected_option && !question.is_correct) {
                          bgColor = "bg-red-50";
                          borderColor = "border-red-500";
                        }

                        return (
                          <div
                            key={letter}
                            className={`p-4 rounded-lg border-2 ${bgColor} ${borderColor} transition`}
                          >
                            <span className="font-bold text-gray-700">{letter}.</span>
                            <span className="ml-2 text-gray-700">{optionText}</span>
                            {letter === question.correct_option && (
                              <span className="ml-2 text-sm text-green-600 font-medium">
                                ✓ Correct Answer
                              </span>
                            )}
                            {letter === question.selected_option && !question.is_correct && (
                              <span className="ml-2 text-sm text-red-600 font-medium">
                                ✗ Your Answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Answer Info Box */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <span className="text-sm text-gray-600">Your Answer:</span>
                          <span className={`ml-2 font-semibold ${!question.is_correct ? 'text-red-600' : 'text-green-600'}`}>
                            {question.selected_option || "Not answered"}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Correct Answer:</span>
                          <span className="ml-2 font-semibold text-green-600">
                            {question.correct_option}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Result:</span>
                          <span className={`ml-2 font-semibold ${question.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                            {question.is_correct ? "✓ Correct" : "✗ Incorrect"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="text-4xl mb-3">🤔</div>
                  <p className="text-gray-500">
                    {showWrongOnly ? "No wrong answers! Great job! 🎉" : "No questions available"}
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              {filteredQuestions.length > 0 && (
                <div className="flex justify-between gap-4 mt-6">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className={`flex-1 px-5 py-2 rounded-lg font-medium transition ${
                      currentQuestion === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    ← Previous
                  </button>
                  
                  <button
                    onClick={() => setCurrentQuestion(Math.min(filteredQuestions.length - 1, currentQuestion + 1))}
                    disabled={currentQuestion === filteredQuestions.length - 1}
                    className={`flex-1 px-5 py-2 rounded-lg font-medium transition ${
                      currentQuestion === filteredQuestions.length - 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
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

export default AnalysisPage;