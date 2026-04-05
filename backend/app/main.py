from fastapi import FastAPI
from .database import engine
from . import models
from .routes import user, test, leaderboard, admin, analytics, performance, tasks, career
from fastapi.middleware.cors import CORSMiddleware
#--------------------------------kajal---------------
from app.routes.resume import router as resume_router
from app.routes.practice import router as practice_router

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

# include routers
app.include_router(user.router)
app.include_router(test.router)
app.include_router(performance.router)
app.include_router(leaderboard.router)
app.include_router(analytics.router)
app.include_router(admin.router)
app.include_router(tasks.router)
app.include_router(resume_router)
app.include_router(practice_router)

# your module
app.include_router(career.router, prefix="/career", tags=["Career"])

# DB
models.Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# test route
@app.get("/")
def home():
    return {"message": "AI Career Platform API is running 🚀"}