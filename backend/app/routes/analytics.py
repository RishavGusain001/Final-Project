from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Subject
from app.database import get_db
from app.auth import get_current_user
from app.models import TestAttempt,Question,StudentAnswer

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/ai-insights")
def ai_insights(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    results = db.query(
        Question.subject_id.label('subject_name'),
        func.sum(StudentAnswer.is_correct).label('correct_answers'),
        func.count(StudentAnswer.id).label('total_answers')
    ).join(
        Question, StudentAnswer.question_id == Question.id
    ).join(
        TestAttempt, StudentAnswer.attempt_id == TestAttempt.id
    ).filter(
        TestAttempt.user_id == user_id
    ).group_by(
        Question.subject_id
    ).all()

    if not results:
        return {
            "message": "No data available"
        }

    weakest_subject = None
    lowest_accuracy = 100

    for r in results:
        if r.total_questions == 0:
            continue

        accuracy = (float(r.total_score) / float(r.total_questions)) * 100

        if accuracy < lowest_accuracy:
            lowest_accuracy = accuracy
            weakest_subject = r.name

    # Recommendation logic
    if lowest_accuracy < 40:
        recommendation = "Practice Easy Questions"
    elif lowest_accuracy < 70:
        recommendation = "Practice Medium Questions"
    else:
        recommendation = "Practice Hard Questions"

    return {
        "weak_subject": weakest_subject,
        "accuracy": round(lowest_accuracy, 2),
        "recommendation": recommendation
    }