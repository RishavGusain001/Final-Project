from fastapi import APIRouter, UploadFile, File
import re

router = APIRouter(prefix="/resume", tags=["Resume Analysis"])

# Dummy skill database
SKILLS_DB = [
    "python", "java", "c++", "react", "node", "sql",
    "machine learning", "data analysis", "html", "css"
]


def extract_text(file_bytes):
    try:
        text = file_bytes.decode("utf-8", errors="ignore")
        return text.lower()
    except:
        return ""


def analyze_resume_text(text):
    found_skills = []
    for skill in SKILLS_DB:
        if re.search(rf"\b{skill}\b", text):
            found_skills.append(skill.capitalize())

    missing_skills = list(set([s.capitalize() for s in SKILLS_DB]) - set(found_skills))

    score = min(100, len(found_skills) * 10)

    suggestions = []
    if len(found_skills) < 5:
        suggestions.append("Add more relevant technical skills")
    if "projects" not in text:
        suggestions.append("Include project experience")
    if "experience" not in text:
        suggestions.append("Add work experience section")

    if not suggestions:
        suggestions.append("Great resume! Just polish formatting")

    return {
        "score": score,
        "skills_found": found_skills,
        "missing_skills": missing_skills[:5],
        "suggestions": suggestions
    }


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    content = await file.read()
    text = extract_text(content)

    result = analyze_resume_text(text)

    return result


@router.get("/result")
async def get_result():
    return {
        "score": 75,
        "skills_found": ["Python", "React"],
        "missing_skills": ["Machine Learning", "SQL"],
        "suggestions": ["Add more projects"]
    }