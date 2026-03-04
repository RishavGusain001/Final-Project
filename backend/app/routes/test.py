from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Question, TestAttempt
from app.auth import get_current_user
from app.ml.predictor import predict_final_score
from datetime import datetime
from fastapi import HTTPException

router = APIRouter(prefix="/test", tags=["Test"])

# ------------------------
# Get Questions
# ------------------------
@router.get("/questions/{subject_id}")
def get_questions(subject_id: str, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(
        Question.subject_id == subject_id
    ).all()

    return questions
# ------------------------
# Performance History
# ------------------------
@router.get("/performance")
def performance(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    attempts = db.query(TestAttempt).filter(
    TestAttempt.user_id == user_id
).all()

    return attempts


# ------------------------
# AI Prediction
# ------------------------
@router.get("/predict")
def predict_performance(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    attempts = db.query(TestAttempt).filter(
    TestAttempt.user_id == user_id
).all()

    scores = [a.score for a in attempts]

    predicted = predict_final_score(scores)

    risk = "Low"
    if predicted < 40:
        risk = "High"
    elif predicted < 70:
        risk = "Medium"

    return {
        "predicted_score": predicted,
        "risk_level": risk
    }

# ------------------------
# submit
# ------------------------
@router.post("/submit")
def submit_test(
    subject_id: str,
    answers: dict,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    questions = db.query(Question).filter(
        Question.subject_id == subject_id
    ).all()

    if not questions:
        raise HTTPException(status_code=404, detail="No questions found")

    score = 0

    for q in questions:
        if str(q.id) in answers:
            if answers[str(q.id)] == q.correct_option:
                score += 1

    new_attempt = TestAttempt(
        user_id=user_id,
        subject=subject_id,
        score=score,
        total_questions=len(questions),
        attempted_at=datetime.utcnow()
    )

    db.add(new_attempt)
    db.commit()

    return {
        "score": score,
        "total_questions": len(questions)
    }