# 🚀 AI Career Platform  
An Intelligent Academic & Career Guidance System built using FastAPI, React, MySQL and Machine Learning.

---

## 📖 Overview

AI Career Platform is a full-stack web application designed to:

- 📊 Analyze academic performance
- 🧠 Predict final grades using ML
- 💼 Recommend suitable career paths
- 📈 Detect skill gaps
- 📄 Generate & analyze resumes using NLP
- 🎯 Provide adaptive learning & practice suggestions

This project is developed as a BCA Major Project (Full Stack + AI Integration).

---

## 🏗️ Tech Stack

### 🔹 Backend
- FastAPI
- SQLAlchemy
- MySQL
- JWT Authentication
- Pydantic

### 🔹 Frontend
- React
- Axios
- Chart.js / Recharts
- Tailwind / CSS

### 🔹 Machine Learning
- Scikit-learn
- Random Forest (Career Recommendation)
- Regression Model (Performance Prediction)
- TF-IDF + Cosine Similarity (Resume Analyzer)

---

## 👥 Team Members

| Member | Module |
|--------|--------|
| Rishav (Backend Lead) | Core Backend + Integration |
| Sneha | Academic Performance & Prediction |
| Kajal | Career Recommendation + Resume NLP |

---

# 📂 Project Structure

```
ai-career-platform/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── auth.py
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── ml-models/
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation Guide

## 🔹 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-career-platform.git
cd ai-career-platform
```

---

## 🔹 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Create `.env` file inside backend:

```
DATABASE_URL=mysql+pymysql://username:password@localhost/ai_career
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Run backend server:

```bash
uvicorn app.main:app --reload
```

Backend runs at:
```
http://127.0.0.1:8000
```

---

## 🔹 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:
```
http://localhost:3000
```

---

## 🔹 4. Database Setup

Open MySQL and run:

```sql
CREATE DATABASE ai_career;
```

Tables will be created automatically using SQLAlchemy models.

---

# 🧠 Key Modules

## 📊 Academic Performance & Test Intelligence
- Subject-wise tests
- Timer-based evaluation
- Score storage
- Performance trend charts
- ML-based final score prediction

## 💼 Career Recommendation & Skill Gap
- Career prediction using Random Forest
- Compatibility score calculation
- Skill gap percentage
- Radar & bar graph visualization

## 📄 Resume Builder & Analyzer
- Resume generation (PDF)
- NLP-based resume scoring
- TF-IDF + Cosine Similarity
- Missing keyword detection

## 🎯 Adaptive Learning System
- Weak topic detection
- Dynamic practice question difficulty
- Notes tracking

---

# 🔐 Environment Variables

Do NOT commit `.env`.

Use `.env.example` as template.

---

# 🌳 Git Workflow

- `main` → Stable Production
- `develop` → Integration Branch
- `feature/*` → Individual modules

No direct push to `main`.

---

# 📈 Future Improvements

- Docker Deployment
- CI/CD Integration
- Cloud Hosting
- Advanced ML models
- Real-time analytics dashboard

---

# 📜 License

This project is developed for educational purposes.

---

# ⭐ If you like this project, give it a star!

```
AI-Career-Platform
├─ backend
│  ├─ app
│  │  ├─ auth.py
│  │  ├─ database.py
│  │  ├─ main.py
│  │  ├─ ml
│  │  │  └─ predictor.py
│  │  ├─ models.py
│  │  ├─ routes
│  │  │  ├─ admin.py
│  │  │  ├─ analytics.py
│  │  │  ├─ leaderboard.py
│  │  │  ├─ performance.py
│  │  │  ├─ tasks.py
│  │  │  ├─ test.py
│  │  │  ├─ user.py
│  │  │  └─ __init__.py
│  │  ├─ schemas.py
│  │  └─ __init__.py
│  └─ requirements.txt
├─ database
├─ frontend
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  └─ robots.txt
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.js
│  │  ├─ App.test.js
│  │  ├─ components
│  │  │  └─ ScoreGraph.js
│  │  ├─ index.css
│  │  ├─ index.js
│  │  ├─ layout
│  │  │  └─ DashboardLayout.js
│  │  ├─ logo.svg
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ AddQuestionPage.js
│  │  │  │  └─ ManageQuestionsPage.js
│  │  │  ├─ AnalysisPage.js
│  │  │  ├─ Dashboard.js
│  │  │  ├─ LeaderboardPage.js
│  │  │  ├─ Login.js
│  │  │  ├─ PracticePage.js
│  │  │  ├─ Register.js
│  │  │  ├─ taskpage.js
│  │  │  ├─ TestHistoryPage.js
│  │  │  └─ TestPage.js
│  │  ├─ reportWebVitals.js
│  │  ├─ services
│  │  │  └─ api.js
│  │  └─ setupTests.js
│  └─ tailwind.config.js
└─ README.md

```