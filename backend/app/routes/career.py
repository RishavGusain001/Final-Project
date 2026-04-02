from fastapi import APIRouter
from pydantic import BaseModel
import pickle

router = APIRouter()

# Load ML model
model = pickle.load(open("app/ml/career_model.pkl", "rb"))

class CareerInput(BaseModel):
    python: int
    java: int
    ml: int
    sql: int
    web_dev: int
    interest: int
    cgpa: float
    projects: int


@router.post("/predict")
def predict_career(data: CareerInput):

    input_data = [[
        data.python,
        data.java,
        data.ml,
        data.sql,
        data.web_dev,
        data.interest,
        data.cgpa,
        data.projects
    ]]

    probs = model.predict_proba(input_data)[0]
    classes = model.classes_

    results = []
    for i in range(len(classes)):
        results.append({
            "career": classes[i],
            "score": round(probs[i] * 100, 2)
        })

    top_3 = sorted(results, key=lambda x: x["score"], reverse=True)[:3]

    return {
        "top_careers": top_3
    }


@router.post("/skill-gap")
def skill_gap(data: CareerInput):

    career_skills = {
        "Frontend Developer": ["HTML", "CSS", "JavaScript"],
        "Backend Developer": ["Java", "Node.js", "Databases"],
        "Full Stack Developer": ["HTML", "CSS", "JavaScript", "Backend"],
        "Web Developer": ["HTML", "CSS", "JavaScript"],
        "Mobile App Developer": ["Java", "Kotlin", "Flutter"],
        "Data Scientist": ["Python", "ML", "Statistics"],
        "Data Analyst": ["SQL", "Excel", "Visualization"],
        "AI Engineer": ["Python", "Deep Learning", "ML"],
        "Machine Learning Engineer": ["Python", "ML", "Deployment"],
        "Cyber Security Analyst": ["Networking", "Security", "Linux"],
        "DevOps Engineer": ["Docker", "CI/CD", "Cloud"],
        "Cloud Engineer": ["AWS", "Azure", "Cloud"],
        "Software Engineer": ["DSA", "OOP", "System Design"],
        "Game Developer": ["C++", "Unity", "Graphics"],
        "UI/UX Designer": ["Figma", "Design", "User Research"]
    }

    input_data = [[
        data.python,
        data.java,
        data.ml,
        data.sql,
        data.web_dev,
        data.interest,
        data.cgpa,
        data.projects
    ]]

    predicted_career = model.predict(input_data)[0]
    required = career_skills.get(predicted_career, [])

    user_skills = []
    if data.python: user_skills.append("Python")
    if data.java: user_skills.append("Java")
    if data.ml: user_skills.append("ML")
    if data.sql: user_skills.append("SQL")
    if data.web_dev: user_skills.append("Web Dev")

    missing = list(set(required) - set(user_skills))
    gap = (len(missing) / len(required)) * 100 if required else 0

    return {
        "career": predicted_career,
        "missing_skills": missing,
        "gap_percentage": round(gap, 2)
    }