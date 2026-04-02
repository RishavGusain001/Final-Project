import axios from "axios";

// Create Axios Instance
const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT Token Automatically
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ❌ Handle Global Errors (optional but useful)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // If unauthorized → redirect to login (optional)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


// ==============================
// 📄 RESUME APIs
// ==============================

// Upload Resume
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get Resume Analysis
export const getResumeAnalysis = async () => {
  return API.get("/resume/result");
};


// ==============================
// 🔓 AUTH APIs (optional reuse)
// ==============================

export const loginUser = (data) => API.post("/login", data);
export const registerUser = (data) => API.post("/register", data);


// ==============================
// 📊 OTHER EXISTING APIs (optional placeholders)
// ==============================

export const getLeaderboard = () => API.get("/leaderboard");
export const getAnalytics = () => API.get("/analytics");


// Export main API instance
export default API;

// resume history api
export const getResumeHistory = () => API.get("/resume/history");