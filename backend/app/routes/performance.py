from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import TestAttempt
from app.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/analytics", tags=["Performance Analytics"])

@router.get("/performance")
def get_performance(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    
    attempts = db.query(TestAttempt).filter(
        TestAttempt.user_id == user_id
    ).all()

    if not attempts:
        return {"message": "No test attempts found"}

    total_tests = len(attempts)

    average_score = sum([a.score for a in attempts]) / total_tests

    # Subject-wise average
    subject_data = (
        db.query(
            TestAttempt.subject,
            func.avg(TestAttempt.score).label("avg_score")
        )
        .filter(TestAttempt.user_id == user_id)
        .group_by(TestAttempt.subject)
        .all()
    )

    best_subject = max(subject_data, key=lambda x: x.avg_score).subject
    weak_subject = min(subject_data, key=lambda x: x.avg_score).subject

    # Risk level logic
    if average_score >= 75:
        level = "Excellent"
    elif average_score >= 60:
        level = "Good"
    elif average_score >= 40:
        level = "Average"
    else:
        level = "High Risk"

    return {
        "total_tests": total_tests,
        "average_score": round(average_score, 2),
        "best_subject": best_subject,
        "weak_subject": weak_subject,
        "performance_level": level
    }

@router.get("/trend")
def get_trend(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    attempts = (
        db.query(TestAttempt)
        .filter(TestAttempt.user_id == user_id)
        .order_by(TestAttempt.attempted_at.asc())
        .all()
    )

    if len(attempts) < 2:
        return {"message": "Not enough data for trend analysis"}

    first_score = attempts[0].score
    latest_score = attempts[-1].score

    improvement = latest_score - first_score

    if first_score != 0:
        improvement_percentage = (improvement / first_score) * 100
    else:
        improvement_percentage = 0

    if improvement > 5:
        trend = "Improving"
    elif improvement < -5:
        trend = "Declining"
    else:
        trend = "Stable"

    return {
        "trend": trend,
        "first_score": first_score,
        "latest_score": latest_score,
        "improvement_percentage": round(improvement_percentage, 2)
    }

@router.get("/graph")
def graph_data(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    attempts = (
        db.query(TestAttempt)
        .filter(TestAttempt.user_id == user_id)
        .order_by(TestAttempt.attempted_at.asc())
        .all()
    )

    if not attempts:
        return {"message": "No data available"}

    dates = []
    scores = []

    for attempt in attempts:
        # Convert datetime to readable date
        formatted_date = attempt.attempted_at.strftime("%Y-%m-%d")
        dates.append(formatted_date)
        scores.append(attempt.score)

    return {
        "dates": dates,
        "scores": scores
    }