from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models import Question, TestAttempt, StudentAnswer
from app.auth import get_current_user
from app.ml.predictor import predict_final_score

router = APIRouter(prefix="/test", tags=["Test"])

# ------------------------
# Get Questions
# ------------------------
@router.get("/questions/{subject_id}")
def get_questions(subject_id: str, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(
        Question.subject_id == subject_id
    ).all()

    if not questions:
        raise HTTPException(status_code=404, detail="No questions found")
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
# Submit Test
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

    # Step 1: Create TestAttempt
    new_attempt = TestAttempt(
        user_id=user_id,
        subject=subject_id,
        score=0,  # temporary, updated after saving answers
        total_questions=len(questions),
        attempted_at=datetime.utcnow()
    )

    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)

    score = 0

    # Step 2: Save Student Answers
    for q in questions:
        if str(q.id) in answers:
            selected = answers[str(q.id)]
            is_correct = selected == q.correct_option

            if is_correct:
                score += 1

            student_answer = StudentAnswer(
                attempt_id=new_attempt.id,
                question_id=q.id,
                selected_option=selected,
                is_correct=is_correct
            )
            db.add(student_answer)

    # Step 3: Update final score
    new_attempt.score = score
    db.commit()

    return {
        "score": score,
        "total_questions": len(questions)
    }

# ------------------------
# Test Analysis Route
# ------------------------
@router.get("/analysis/{attempt_id}")
def test_analysis(
    attempt_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    # Verify attempt belongs to user
    attempt = db.query(TestAttempt).filter(
        TestAttempt.id == attempt_id,
        TestAttempt.user_id == user_id
    ).first()

    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    # Fetch all answers with questions
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