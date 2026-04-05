from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime, Date, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
from sqlalchemy.sql import func

class Roadmap(Base):
    __tablename__ = "roadmap"

    id = Column(Integer, primary_key=True, index=True)
    career_id = Column(Integer, ForeignKey("careers.id"), nullable=False)
    step_number = Column(Integer, nullable=False)
    step_title = Column(String(255))
    step_description = Column(String)

    career = relationship("Career", back_populates="roadmaps")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), default="user")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    question_text = Column(Text, nullable=False)
    option_a = Column(String(255))
    option_b = Column(String(255))
    option_c = Column(String(255))
    option_d = Column(String(255))
    correct_option = Column(String(1))
    difficulty = Column(String(20))

class TestAttempt(Base):
    __tablename__ = "test_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject = Column(String(100))
    score = Column(Float)
    total_questions = Column(Integer)
    attempted_at = Column(DateTime, default=datetime.utcnow)

class StudentAnswer(Base):
    __tablename__ = "student_answers"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("test_attempts.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    selected_option = Column(String(1))
    is_correct = Column(Boolean)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255), nullable=False)
    priority = Column(String(20))
    subject = Column(String(100))
    due_date = Column(Date)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class TaskStreak(Base):
    __tablename__ = "task_streaks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    last_completed_date = Column(Date)
    streak_count = Column(Integer, default=0)

class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    description = Column(String(400))

    # ✅ Relationships
    skills = relationship("Skill", back_populates="career")
    roadmaps = relationship("Roadmap", back_populates="career")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(400))
    career_id = Column(Integer, ForeignKey("careers.id"))

    career = relationship("Career", back_populates="skills")

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    predicted_career = Column(String(400))
    score = Column(Float)

class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    score = Column(Integer)
    ats_score = Column(Integer)
    predicted_role = Column(String(100))
    confidence = Column(Float)
    skills = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
