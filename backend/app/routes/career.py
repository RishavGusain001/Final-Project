from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

class CareerInput(BaseModel):
    skills: list[str]
    interests: list[str]


@router.post("/predict")
def predict_career(data: CareerInput):
    
    careers = ["Web Developer", "Data Scientist", "AI Engineer"]

    predicted = random.choice(careers)

    return {
        "career": predicted,
        "score": round(random.uniform(60, 95), 2)
    }


@router.post("/skill-gap")
def skill_gap(data: CareerInput):

    required_skills = ["Python", "ML", "Statistics"]

    missing = list(set(required_skills) - set(data.skills))

    gap = (len(missing) / len(required_skills)) * 100

    return {
        "missing_skills": missing,
        "gap_percentage": gap
    }