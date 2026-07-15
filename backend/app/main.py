from fastapi.middleware.cors import CORSMiddleware
from app.schemas import PredictRequest
from fastapi import FastAPI
from app.routes.predict import router

app = FastAPI(title="F1 AI Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)

@app.get("/")
def home():
    return {
        "message": "Welcome to F1 AI Analytics API"
    }

@app.get("/health")
def health():
    return {
        "status": "Running"
    }