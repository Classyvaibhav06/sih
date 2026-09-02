"""Student endpoint stubs."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter()

@router.get("/me")
async def get_my_profile(db: AsyncSession = Depends(get_db)):
    return {"id": "demo", "name": "Aarav Sharma", "role": "student"}

@router.get("/me/dashboard")
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    return {
        "streak": 14,
        "xp": 3240,
        "level": 12,
        "weekly_goal_pct": 68,
        "weekly_studied_hours": 3.4,
        "avg_mastery": 69,
        "due_revisions": 4,
        "today_plan": [
            {"title": "Recursion Practice", "type": "practice", "minutes": 20, "mastery": 43},
            {"title": "DBMS Revision", "type": "revision", "minutes": 15, "mastery": 82},
            {"title": "10 Practice Questions", "type": "quiz", "minutes": 10, "mastery": None},
        ],
        "mastery_by_subject": [
            {"subject": "Data Structures", "score": 71},
            {"subject": "DBMS", "score": 82},
            {"subject": "Operating Systems", "score": 57},
            {"subject": "Computer Networks", "score": 64},
        ],
        "weak_concepts": [
            {"name": "Binary Trees", "subject": "DSA", "score": 38, "reason": "3 failed attempts"},
            {"name": "Recursion", "subject": "DSA", "score": 43, "reason": "High response times"},
            {"name": "OS Scheduling", "subject": "OS", "score": 49, "reason": "Repeated missed"},
        ],
        "revision_due": [
            {"name": "Binary Search", "recall": 63, "due_in": "Today"},
            {"name": "Normalization (DBMS)", "recall": 71, "due_in": "Today"},
        ],
    }
