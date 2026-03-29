from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Question
from app.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/admin/questions")
def get_all_questions(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return db.query(Question).all()


@router.delete("/admin/question/{id}")
def delete_question(
    id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    question = db.query(Question).filter(Question.id == id).first()

    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    db.delete(question)
    db.commit()

    return {"message": "Question deleted successfully"}

# ------------------------
# Add Question (Admin Only)
# ------------------------
@router.post("/add-question")
def add_question(
    question_text: str,
    option_a: str,
    option_b: str,
    option_c: str,
    option_d: str,
    correct_option: str,
    subject: str,
    difficulty: str,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)  # 🔥 HERE
):
    new_question = Question(
        question_text=question_text,
        option_a=option_a,
        option_b=option_b,
        option_c=option_c,
        option_d=option_d,
        correct_option=correct_option,
        subject=subject,
        difficulty=difficulty
    )

    db.add(new_question)
    db.commit()

    return {"message": "Question added successfully"}