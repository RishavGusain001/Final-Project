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

  useEffect(() => {
    fetchTasks();
    fetchAnalytics();
    fetchStreak();
    fetchUser();
  }, []);

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
    if (!title) return alert("Enter task");

    try {
      const data = {
        title,
        priority,
        subject: subject || null,
        due_date: dueDate || null,
      };

      if (editId) {
        await API.put(`/tasks/${editId}`, data);
        setEditId(null);
      } else {
        await API.post("/tasks/", data);
      }

      setTitle("");
      setSubject("");
      setDueDate("");
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
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id) => {
    try {
      await API.put(`/tasks/complete/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (p) => {
    if (p === "High") return "border-red-500";
    if (p === "Medium") return "border-yellow-500";
    return "border-green-500";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-xl shadow-md">

        {/* STREAK */}
        <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">
                👋 Hello, {getGreeting()}, <span className="text-blue-600">{username}</span>
            </h2>
            <h2 className="text-lg font-semibold">
                🔥 {streak} day streak.   Stay consistent, you're doing great 🚀
            </h2>
        </div>

        <h2 className="text-2xl font-bold mb-4">📋 Daily Tasks</h2>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task..."
            className="p-2 border rounded"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 border rounded"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject (OS, DBMS)"
            className="p-2 border rounded"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          {editId ? "Update Task" : "Add Task"}
        </button>

        {/* TASK LIST */}
        {tasks.map((t) => (
          <div
            key={t.id}
            className={`p-4 mb-3 border-l-4 rounded shadow-sm flex justify-between items-center ${getPriorityColor(t.priority)} ${
              t.is_completed ? "bg-green-100" : "bg-gray-50"
            }`}
          >
            <div>
              <p className={`font-semibold ${t.is_completed ? "line-through" : ""}`}>
                {t.title}
              </p>
              <small className="text-gray-600">
                {t.subject || "No Subject"} | {t.priority} | 📅 {t.due_date || "No Date"}
              </small>
            </div>

            <div className="flex gap-2">
              <button onClick={() => toggleComplete(t.id)}>✅</button>
              <button onClick={() => handleEdit(t)}>✏️</button>
              <button onClick={() => handleDelete(t.id)}>❌</button>
            </div>
          </div>
        ))}

        {/* GRAPH */}
        <div className="bg-gray-100 p-4 rounded mt-6">
          <h3 className="font-semibold mb-2">📊 Task Completion Trend</h3>

          {analytics.length > 0 ? (
            <LineChart width={500} height={250} data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" />
            </LineChart>
          ) : (
            <p>No data yet</p>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default TaskPage;