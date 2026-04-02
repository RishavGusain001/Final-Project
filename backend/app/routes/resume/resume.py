from fastapi import APIRouter, UploadFile, File
from app.ml.resume_analyzer import analyze_resume
from app.database import SessionLocal
from app.models import ResumeAnalysis


router = APIRouter(prefix="/resume", tags=["Resume Analysis"])

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    result = analyze_resume(file.file)
    return result

@router.get("/history")
def get_history():
    db = SessionLocal()
    data = db.query(ResumeAnalysis).order_by(ResumeAnalysis.created_at.desc()).all()
    db.close()

    return data