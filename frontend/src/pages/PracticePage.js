import React, { useState } from "react";
import API from "../services/api";
import DashboardLayout from "../layout/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const PracticePage = () => {
  const [subjectId, setSubjectId] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [analyticsData, setAnalyticsData] = useState([]);

  const loadQuestions = async () => {
    if (!subjectId) {
      alert("Select subject");
      return;
    }

    const res = await API.get(`/test/questions/${subjectId}`);

    let filtered = res.data;

    if (difficulty) {
      filtered = filtered.filter((q) => q.difficulty === difficulty);
    }

    setQuestions(filtered);
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setShowResults(false);
  };

  const selectOption = (question, option) => {
    const newAnswers = { ...answers, [question.id]: option };
    setAnswers(newAnswers);

    if (option === question.correct_option) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitPractice = () => {
    setShowResults(true);

    const data = [
      { name: "Correct", value: score },
      { name: "Wrong", value: questions.length - score },
    ];

    setAnalyticsData(data);
  };

  const retryPractice = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };

  const question = questions[currentQuestion];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* START SECTION */}
        {questions.length === 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Practice Mode</h2>

            <select
              className="w-full p-2 border rounded mb-4"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="">Select Subject</option>
              <option value="1">Math</option>
              <option value="2">English</option>
            </select>

            <select
              className="w-full p-2 border rounded mb-4"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <button
              onClick={loadQuestions}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Start Practice
            </button>
          </>
        )}

        {/* QUESTION SECTION */}
        {questions.length > 0 && !showResults && (
          <>
            <h3 className="text-lg font-semibold mb-3">
              Question {currentQuestion + 1} / {questions.length}
            </h3>

            <p className="mb-4">{question?.question_text}</p>

            {["A", "B", "C", "D"].map((letter) => {
              const optionText = question[`option_${letter.toLowerCase()}`];
              const selected = answers[question.id];

              let bg = "";

              if (selected) {
                if (letter === question.correct_option) {
                  bg = "bg-green-200";
                } else if (letter === selected) {
                  bg = "bg-red-200";
                }
              }

              return (
                <button
                  key={letter}
                  onClick={() => selectOption(question, letter)}
                  className={`w-full text-left p-3 border mb-2 rounded ${bg}`}
                >
                  {letter}. {optionText}
                </button>
              );
            })}

            <div className="flex justify-between mt-4">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Previous
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={submitPractice}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Finish Practice
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}

        {/* RESULT SECTION */}
        {showResults && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Practice Result</h2>

            <p className="mb-4">
              Score: {score} / {questions.length}
            </p>

            <div className="flex justify-center">
              <LineChart width={400} height={250} data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" />
              </LineChart>
            </div>

            <button
              onClick={retryPractice}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Practice Again
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PracticePage;