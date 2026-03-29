from fastapi import FastAPI
from .database import engine
from . import models
from .routes import user
from .routes import test
from app.routes import performance
from fastapi.middleware.cors import CORSMiddleware
from .routes import leaderboard
from .routes import analytics
from app.routes import admin

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],   # VERY IMPORTANT
    allow_headers=["*"],   # VERY IMPORTANT
)

app.include_router(user.router)
app.include_router(test.router)
app.include_router(performance.router)
app.include_router(leaderboard.router)
app.include_router(analytics.router)
app.include_router(admin.router)

@app.get("/")
def home():
    return {"message": "AI Career Platform API is running 🚀"}
