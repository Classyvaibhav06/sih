"""Parent Portal & Ward Monitoring endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter()


@router.get("/dashboard")
async def get_parent_dashboard(db: AsyncSession = Depends(get_db)):
    """
    Parent view for tracking their child's academic health:
    - Weekly hours studied and completion rates
    - Mastered strengths and immediate focus areas
    - Actionable recommendations to support learning at home
    """
    return {
        "student_name": "Aarav Sharma",
        "grade": "Class 11 — Science & CS",
        "school": "Delhi Public School, R.K. Puram",
        "weekly_hours": 6.8,
        "completion_rate": 92,
        "overall_mastery": 69,
        "streak": 14,
        "strengths": [
            "Database Normalization (88% mastery)",
            "Array Algorithms & Time Complexity (92% mastery)",
            "14-Day Consistent Study Streak",
        ],
        "focus_areas": [
            "Binary Search Trees (Needs practice before test)",
            "Recursion Stack Space (High hesitation time)",
        ],
        "recent_activities": [
            {
                "date": "Today, 4:15 PM",
                "action": "Completed 15 min Spaced Revision on DBMS",
                "duration": "15m",
                "score": "88%",
            },
            {
                "date": "Yesterday, 6:00 PM",
                "action": "Interacted with AdaptiveX AI Tutor on Recursion",
                "duration": "24m",
                "score": "Guided",
            },
            {
                "date": "2 days ago",
                "action": "Solved 10 Practice Questions in Data Structures",
                "duration": "20m",
                "score": "70%",
            },
        ],
        "recommended_actions": [
            "Encourage Aarav to spend 15 minutes reviewing Binary Trees flashcards before Friday.",
            "Acknowledge his 14-day study streak milestone to maintain positive momentum!",
            "Weekly study goal (6 hours) achieved! 🌟",
        ],
    }
