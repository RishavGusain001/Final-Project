import React, { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../layout/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [streak, setStreak] = useState(0);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, completed

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchTasks(), fetchAnalytics(), fetchStreak(), fetchUser()]);
    setLoading(false);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await API.get("/users/me");
      setUsername(res.data.name);
    } catch (err) {
      console.log("User fetch failed");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/tasks/analytics");
      setAnalytics(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStreak = async () => {
    try {
      const res = await API.get("/tasks/streak");
      setStreak(res.data.streak || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a task");
      return;
    }

    try {
      const data = {
        title: title.trim(),
        priority,
        subject: subject.trim() || null,
        due_date: dueDate || null,
      };

      if (editId) {
        await API.put(`/tasks/${editId}`, data);
        setEditId(null);
      } else {
        await API.post("/tasks/", data);
      }

      // Reset form
      setTitle("");
      setSubject("");
      setDueDate("");
      setPriority("Medium");
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Error saving task");
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setPriority(task.priority);
    setSubject(task.subject || "");
    setDueDate(task.due_date ? task.due_date.split("T")[0] : "");
    setEditId(task.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleComplete = async (id) => {
    try {
      await API.put(`/tasks/complete/${id}`);
      fetchTasks();
      fetchStreak();
      fetchAnalytics();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (p) => {
    if (p === "High") return "border-red-500 bg-red-50";
    if (p === "Medium") return "border-yellow-500 bg-yellow-50";
    return "border-green-500 bg-green-50";
  };

  const getPriorityBadge = (p) => {
    if (p === "High") return "bg-red-100 text-red-700";
    if (p === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.is_completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
    return { total, completed, pending, completionRate };
  };

  const stats = getStats();
  const filteredTasks = tasks.filter(task => {
    if (filter === "pending") return !task.is_completed;
    if (filter === "completed") return task.is_completed;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">
                  {getGreeting()}, <span className="text-blue-600">{username || "Learner"}!</span>
                </h1>
                <p className="text-gray-500">Stay organized and track your daily progress</p>
              </div>
              <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                <span className="text-orange-600 font-semibold">🔥 {streak} day streak</span>
                <span className="text-sm text-gray-500 ml-2">Keep going!</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Total Tasks</span>
                <span className="text-2xl">📋</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-2">{stats.total}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Completed</span>
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-2xl font-bold text-green-600 mt-2">{stats.completed}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Pending</span>
                <span className="text-2xl">⏳</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600 mt-2">{stats.pending}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Completion Rate</span>
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 mt-2">{stats.completionRate}%</div>
            </div>
          </div>

          {/* Add/Edit Task Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>{editId ? "✏️" : "➕"}</span>
              <span>{editId ? "Edit Task" : "Add New Task"}</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title..."
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🟢 Low Priority</option>
              </select>

              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject (e.g., Python, DSA)"
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
              >
                {editId ? "Update Task" : "Add Task"}
              </button>
              {editId && (
                <button
                  onClick={() => {
                    setEditId(null);
                    setTitle("");
                    setSubject("");
                    setDueDate("");
                    setPriority("Medium");
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Tasks ({stats.total})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "pending" 
                  ? "bg-yellow-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "completed" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>

          {/* Task List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
              <p className="text-gray-500">
                {filter === "all" 
                  ? "Create your first task to get started!" 
                  : filter === "pending" 
                  ? "Great job! No pending tasks 🎉" 
                  : "Complete some tasks to see them here"}
              </p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-4 rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md ${getPriorityColor(t.priority)} ${
                    t.is_completed ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <p className={`font-semibold text-gray-800 ${t.is_completed ? "line-through" : ""}`}>
                          {t.title}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(t.priority)}`}>
                          {t.priority}
                        </span>
                        {t.subject && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            📚 {t.subject}
                          </span>
                        )}
                        {t.due_date && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            📅 {new Date(t.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <small className="text-gray-500">
                        Created: {new Date(t.created_at).toLocaleDateString()}
                      </small>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleComplete(t.id)}
                        className="w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                        title={t.is_completed ? "Mark incomplete" : "Mark complete"}
                      >
                        {t.is_completed ? "🔄" : "✅"}
                      </button>
                      <button
                        onClick={() => handleEdit(t)}
                        className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                        title="Edit task"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analytics Graph */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📊</span> Task Completion Trend
            </h3>
            {analytics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-gray-500">Complete tasks to see your progress chart</p>
              </div>
            )}
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

export default TaskPage;