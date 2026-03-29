import React, { useEffect, useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layout/DashboardLayout";

const ManageQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await API.get("/admin/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching questions");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await API.delete(`/admin/question/${id}`);
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">Manage Questions</h2>

        {questions.length === 0 ? (
          <p>No questions found</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Question</th>
                <th className="p-2">Subject</th>
                <th className="p-2">Difficulty</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="border-t text-center">
                  <td className="p-2">{q.id}</td>
                  <td className="p-2">{q.question_text}</td>
                  <td className="p-2">{q.subject_id}</td>
                  <td className="p-2">{q.difficulty}</td>

                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageQuestionsPage;