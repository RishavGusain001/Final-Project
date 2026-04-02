import pickle
import re
import pdfplumber
from nltk.corpus import stopwords

from app.database import SessionLocal
from app.models import ResumeAnalysis

STOPWORDS = set(stopwords.words("english"))

# Load trained model
model = pickle.load(open("app/ml/model/resume_model.pkl", "rb"))

# 🔹 Clean text
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-Z ]", " ", text)
    text = " ".join([word for word in text.split() if word not in STOPWORDS])
    return text


# 🔹 Extract text from PDF
def extract_text(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


# 🔹 Predict role + confidence
def predict_role(text):
    cleaned = clean_text(text)

    role = model.predict([cleaned])[0]
    confidence = max(model.decision_function([cleaned])[0])

    return role, float(confidence)


# 🔹 Skill extraction (basic but effective)
SKILLS = [
    "python", "java", "c++", "react", "node",
    "sql", "machine learning", "data analysis",
    "html", "css"
]

def extract_skills(text):
    return [s.capitalize() for s in SKILLS if s in text.lower()]

# 🔥 SAVE FUNCTION (ADD THIS ABOVE analyze_resume)
def save_to_db(result):
    db = SessionLocal()

    new_entry = ResumeAnalysis(
        user_id=None,
        score=result["score"],
        ats_score=result["ats_score"],
        predicted_role=result["predicted_role"],
        confidence=result["confidence"],
        skills=",".join(result["skills_found"])
    )

    db.add(new_entry)
    db.commit()
    db.close()


# 🔥 MAIN FUNCTION (ADD YOUR CODE HERE)
def analyze_resume(file):
    text = extract_text(file)

    role, confidence = predict_role(text)
    skills = extract_skills(text)

    result = {
        "score": min(100, len(skills) * 12),
        "ats_score": min(100, 50 + len(skills) * 5),
        "predicted_role": role,
        "confidence": round(confidence, 2),
        "skills_found": skills,
        "suggestions": [
            "Add more relevant technical skills",
            "Include measurable achievements",
            "Improve formatting for ATS systems"
        ]
    }

    # 🔥 SAVE TO DATABASE (THIS LINE YOU ASKED ABOUT)
    save_to_db(result)

    return result
