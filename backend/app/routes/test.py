from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.models import Question, TestAttempt, StudentAnswer
from app.auth import get_current_user
from app.ml.predictor import predict_final_score

router = APIRouter(prefix="/test", tags=["Test"])


# ============================
# GET SUBJECTS (DYNAMIC)
# ============================
@router.get("/subjects")
def get_subjects(db: Session = Depends(get_db)):
    subjects = (
        db.query(Question.subject_id)
        .distinct()
        .all()
    )

    return [
        {"id": s[0], "name": f"Subject {s[0]}"}
        for s in subjects
    ]


# ============================
# GET RANDOM QUESTIONS
# ============================
@router.get("/random")
def get_random_questions(
    count: int = 10,
    subject_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Question)

    # filter by subject if selected
    if subject_id:
        query = query.filter(Question.subject_id == subject_id)

    questions = query.order_by(func.rand()).limit(count).all()

    if not questions:
        raise HTTPException(status_code=404, detail="No questions found")

    return questions


# ============================
# SUBMIT TEST
# ============================
@router.post("/submit")
def submit_test(
    payload: dict,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    """
    payload = {
        "subject_id": 1 (optional),
        "answers": {
            "1": "A",
            "2": "B"
        }
    }
    """

    answers = payload.get("answers", {})
    subject_id = payload.get("subject_id")

    if not answers:
        raise HTTPException(status_code=400, detail="No answers submitted")

    score = 0
    total = len(answers)

    # ====================
    # CREATE TEST ATTEMPT
    # ====================
    new_attempt = TestAttempt(
        user_id=user_id,
        subject=str(subject_id) if subject_id else "Mixed",
        score=0,
        total_questions=total,
        attempted_at=datetime.utcnow()
    )

    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)

    # ====================
    # SAVE ANSWERS
    # ====================
    for q_id, user_ans in answers.items():
        question = db.query(Question).filter(
            Question.id == int(q_id)
        ).first()

        if not question:
            continue

        is_correct = user_ans == question.correct_option

        if is_correct:
            score += 1

        student_answer = StudentAnswer(
            attempt_id=new_attempt.id,
            question_id=question.id,
            selected_option=user_ans,
            is_correct=is_correct
        )

        db.add(student_answer)

    # ====================
    # UPDATE SCORE
    # ====================
    new_attempt.score = score
    db.commit()

    return {
        "message": "Test submitted successfully",
        "score": score,
        "total": total,
        "percentage": round((score / total) * 100, 2)
    }


# ============================
# PERFORMANCE HISTORY
# ============================
@router.get("/performance")
def performance(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    attempts = db.query(TestAttempt).filter(
        TestAttempt.user_id == user_id
    ).all()

    return attempts


# ============================
# AI PREDICTION
# ============================
@router.get("/predict")
def predict_performance(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    attempts = db.query(TestAttempt).filter(
        TestAttempt.user_id == user_id
    ).all()

    scores = [a.score for a in attempts]

    if not scores:
        return {
            "predicted_score": 0,
            "risk_level": "No Data"
        }

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


# ============================
# TEST ANALYSIS
# ============================
@router.get("/analysis/{attempt_id}")
def test_analysis(
    attempt_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    attempt = db.query(TestAttempt).filter(
        TestAttempt.id == attempt_id,
        TestAttempt.user_id == user_id
    ).first()

    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    answers = db.query(StudentAnswer).filter(
        StudentAnswer.attempt_id == attempt_id
    ).all()

    result = []

    for ans in answers:
        question = db.query(Question).filter(
            Question.id == ans.question_id
        ).first()

        if not question:
            continue

        result.append({
            "question_id": question.id,
            "question_text": question.question_text,
            "option_a": question.option_a,
            "option_b": question.option_b,
            "option_c": question.option_c,
            "option_d": question.option_d,
            "correct_option": question.correct_option,
            "selected_option": ans.selected_option,
            "is_correct": ans.is_correct
        })

    return result


# ============================
# ANALYTICS (DASHBOARD)
# ============================
@router.get("/analytics")
def get_analytics(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    answers = db.query(StudentAnswer).filter(
        StudentAnswer.user_id == user_id
    ).all()

    total = len(answers)
    correct = len([a for a in answers if a.is_correct])

    return {
        "total_attempts": total,
        "correct_answers": correct,
        "accuracy": round((correct / total) * 100, 2) if total else 0
    }


# ============================
# STREAK
# ============================
@router.get("/streak")
def get_streak(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    answers = db.query(StudentAnswer).filter(
        StudentAnswer.user_id == user_id
    ).all()

    dates = [a.created_at.date() for a in answers if a.created_at]

    streak = len(set(dates))

    return {"streak": streak}