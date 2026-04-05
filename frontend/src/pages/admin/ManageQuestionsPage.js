import React, { useEffect, useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

const ManageQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [searchTerm, filterSubject, filterDifficulty, questions]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/questions");
      setQuestions(res.data);
      setFilteredQuestions(res.data);
      
      // Extract unique subjects
      const uniqueSubjects = [...new Set(res.data.map(q => q.subject_id).filter(Boolean))];
      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error(err);
      alert("Error fetching questions");
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = [...questions];
    
    // Search by question text
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by subject
    if (filterSubject) {
      filtered = filtered.filter(q => q.subject_id === filterSubject);
    }
    
    // Filter by difficulty
    if (filterDifficulty) {
      filtered = filtered.filter(q => q.difficulty === filterDifficulty);
    }
    
    setFilteredQuestions(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) return;

    try {
      await API.delete(`/admin/question/${id}`);
      setQuestions(questions.filter((q) => q.id !== id));
      alert("✅ Question deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed. Please try again.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-question/${id}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuestions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-lg mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Manage Questions
            </h1>
            <p className="text-gray-500 mt-2">View, edit, and delete practice questions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Total Questions</span>
                <span className="text-2xl">📚</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-2">{questions.length}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Subjects</span>
                <span className="text-2xl">🏷️</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-2">{subjects.length}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Filtered Results</span>
                <span className="text-2xl">🔍</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-2">{filteredQuestions.length}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 Search Questions
                </label>
                <input
                  type="text"
                  placeholder="Search by question text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📚 Filter by Subject
                </label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📊 Filter by Difficulty
                </label>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            
            {(searchTerm || filterSubject || filterDifficulty) && (
              <div className="mt-3 text-right">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterSubject("");
                    setFilterDifficulty("");
                  }}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Add Question Button */}
          <div className="mb-6 text-right">
            <button
              onClick={() => navigate("/admin/add-question")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-sm"
            >
              ➕ Add New Question
            </button>
          </div>

          {/* Questions Table */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No questions found</h3>
              <p className="text-gray-500 mb-6">
                {questions.length === 0 
                  ? "Start by adding your first question!" 
                  : "Try adjusting your filters to see more results"}
              </p>
              {questions.length === 0 && (
                <button
                  onClick={() => navigate("/admin/add-question")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Your First Question →
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-600 to-red-600">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Question</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Subject</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-white">Difficulty</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentItems.map((q, index) => (
                        <tr key={q.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {(indexOfFirstItem + index + 1)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-md">
                              <p className="text-sm text-gray-800 line-clamp-2">
                                {q.question_text}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs text-gray-400">
                                  A: {q.option_a}
                                </span>
                                <span className="text-xs text-gray-400">
                                  B: {q.option_b}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {q.subject_id || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(q.difficulty)}`}>
                              {getDifficultyIcon(q.difficulty)} {q.difficulty || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEdit(q.id)}
                                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDelete(q.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        currentPage === i + 1
                          ? "bg-orange-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Showing Info */}
              <div className="text-center text-sm text-gray-500 mt-4">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredQuestions.length)} of {filteredQuestions.length} questions
              </div>
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ManageQuestionsPage;