from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from datetime import date, timedelta
from app.models import Task, TaskStreak
from sqlalchemy import func
from datetime import datetime
from app import models, auth

router = APIRouter(prefix="/tasks", tags=["Tasks"])

# ------------------ GET TASKS ------------------
@router.get("/")
def get_tasks(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    return db.query(Task).filter(Task.user_id == user_id).all()


# ------------------ ADD TASK ------------------
from datetime import datetime
from app.schemas import TaskCreate

@router.post("/")
def add_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):

    new_task = models.Task(
        user_id=current_user,
        title=task.title,
        priority=task.priority,
        subject=task.subject,
        due_date=task.due_date
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


# ------------------ UPDATE TASK ------------------
@router.put("/{task_id}")
def update_task(
    task_id: int,
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()

    db_task.title = task.title
    db_task.priority = task.priority
    db_task.subject = task.subject
    db_task.due_date = task.due_date

    db.commit()
    db.refresh(db_task)

    return db_task

# ------------------ TOGGLE COMPLETE ------------------

@router.put("/complete/{task_id}")
def toggle_complete(task_id: int,
                    db: Session = Depends(get_db),
                    user_id: int = Depends(get_current_user)):

    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == user_id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.is_completed = not task.is_completed

    # 🔥 STREAK LOGIC
    if task.is_completed:
        today = date.today()

        streak = db.query(TaskStreak).filter(
            TaskStreak.user_id == user_id
        ).first()

        if not streak:
            streak = TaskStreak(
                user_id=user_id,
                last_completed_date=today,
                streak_count=1
            )
            db.add(streak)

        else:
            if streak.last_completed_date == today:
                pass  # already counted

            elif streak.last_completed_date == today - timedelta(days=1):
                streak.streak_count += 1
                streak.last_completed_date = today

            else:
                streak.streak_count = 1
                streak.last_completed_date = today

    db.commit()
    return {"message": "Updated"}

@router.get("/streak")
def get_streak(db: Session = Depends(get_db),
               user_id: int = Depends(get_current_user)):

    streak = db.query(TaskStreak).filter(
        TaskStreak.user_id == user_id
    ).first()

    return {"streak": streak.streak_count if streak else 0}

# ------------------ DELETE ------------------
@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Deleted"}

# ------------------ Analytics  ------------------
@router.get("/analytics")
def task_analytics(db: Session = Depends(get_db),
                   user_id: int = Depends(get_current_user)):

    data = db.query(
        func.date(Task.created_at),
        func.count(Task.id)
    ).filter(
        Task.user_id == user_id,
        Task.is_completed == True
    ).group_by(func.date(Task.created_at)).all()

    return [{"date": str(d[0]), "count": d[1]} for d in data]