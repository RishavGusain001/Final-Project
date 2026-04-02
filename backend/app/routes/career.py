from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Career, Skill, Roadmap
from pydantic import BaseModel
import pickle

router = APIRouter()

# Load ML model
model = pickle.load(open("app/ml/career_model.pkl", "rb"))

# ✅ Get all careers
@router.get("/careers")
def get_careers(db: Session = Depends(get_db)):
    careers = db.query(Career).all()
    return [c.name for c in careers]

# ✅ Get roadmap for a career
@router.get("/roadmap/{career_name:path}")
def get_roadmap(career_name: str, db: Session = Depends(get_db)):
    print(f"Incoming career_name: '{career_name}'")

    career_obj = (
        db.query(Career)
        .filter(Career.name.ilike(f"%{career_name.strip()}%"))
        .first()
    )

    if not career_obj:
        return {"error": f"Career '{career_name}' not found in careers table"}

    roadmap_steps = (
        db.query(Roadmap)
        .filter(Roadmap.career_id == career_obj.id)
        .order_by(Roadmap.step_number)
        .all()
    )

    if not roadmap_steps:
        return {"error": f"No roadmap found for {career_name}"}

    return [
        {"step": r.step_number, "title": r.step_title, "description": r.step_description}
        for r in roadmap_steps
    ]

# ✅ Career prediction input
class CareerInput(BaseModel):
    python: int
    java: int
    ml: int
    sql: int
    web_dev: int
    interest: int
    cgpa: float
    projects: int

# ✅ Skill gap input
class SkillGapInput(BaseModel):
    career_name: str
    user_skills: list[str]

# ✅ Predict career
@router.post("/predict")
def predict_career(data: CareerInput):
    input_data = [[
        data.python, data.java, data.ml, data.sql,
        data.web_dev, data.interest, data.cgpa, data.projects
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

    return {"top_careers": top_3}

# ✅ Skill gap analyzer
@router.post("/skill-gap")
def skill_gap(data: SkillGapInput, db: Session = Depends(get_db)):
    career_obj = (
        db.query(Career)
        .filter(Career.name.ilike(f"%{data.career_name.strip()}%"))
        .first()
    )
    if not career_obj:
        return {"error": f"Career '{data.career_name}' not found"}

    required_skills = db.query(Skill).filter(Skill.career_id == career_obj.id).all()

    # Normalize both DB skills and user input
    required = [s.name.strip().lower() for s in required_skills]
    user_skills = [skill.strip().lower() for skill in data.user_skills]

    # Optional: synonyms mapping
    synonyms = {
        "js": "javascript",
        "py": "python",
        "cpp": "c++",
        "csharp": "c#",
    }
    user_skills = [synonyms.get(skill, skill) for skill in user_skills]

    missing = list(set(required) - set(user_skills))
    gap = (len(missing) / len(required)) * 100 if required else 0
    compatibility = 100 - gap

    student_scores = [100 if skill in user_skills else 0 for skill in required]
    required_scores = [100 for _ in required]

    return {
        "career": data.career_name,
        "skills": [s.capitalize() for s in required],
        "student_scores": student_scores,
        "required_scores": required_scores,
        "missing": [s.capitalize() for s in missing],
        "gap_percentage": round(gap, 2),
        "compatibility": round(compatibility, 2),
        "recommendations": [f"Study {s.capitalize()}" for s in missing]
    }
