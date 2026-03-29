from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import TestAttempt, User

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("/")
def get_leaderboard(db: Session = Depends(get_db)):

    leaderboard = (
        db.query(
            User.username,
            func.avg(TestAttempt.score).label("avg_score"),
            func.count(TestAttempt.id).label("tests_taken")
        )
        .join(TestAttempt, User.id == TestAttempt.user_id)
        .group_by(User.username)
        .order_by(func.avg(TestAttempt.score).desc())
        .limit(10)
        .all()
    )

    result = []
    rank = 1

    for user in leaderboard:
        result.append({
            "rank": rank,
            "username": user.username,
            "average_score": round(user.avg_score, 2),
            "tests_taken": user.tests_taken
        })
        rank += 1

    return result