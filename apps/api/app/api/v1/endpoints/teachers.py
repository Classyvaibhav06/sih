"""Teacher Analytics & Class Monitoring endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter()


@router.get("/dashboard")
async def get_teacher_dashboard(db: AsyncSession = Depends(get_db)):
    """
    Teacher classroom analytics:
    - At-Risk Student early intervention matrix
    - Topic difficulty breakdown (high failure rate warnings)
    - Real-time active student counts & completion metrics
    """
    return {
        "class_name": "Class 11-A (Computer Science)",
        "subject": "Data Structures & DBMS",
        "total_students": 48,
        "active_today": 39,
        "avg_class_mastery": 72,
        "at_risk_students_count": 3,
        "at_risk_students": [
            {
                "id": "s1",
                "name": "Rohan Verma",
                "grade": "Class 11-A",
                "risk_factor": "High Latency & Low Recall on Binary Trees",
                "weak_topic": "Binary Search Trees",
                "avg_mastery": 41,
            },
            {
                "id": "s2",
                "name": "Ananya Deshmukh",
                "grade": "Class 11-A",
                "risk_factor": "Missing Scheduled Spaced Revisions",
                "weak_topic": "Deadlock Avoidance (Banker's Algorithm)",
                "avg_mastery": 48,
            },
            {
                "id": "s3",
                "name": "Vikram Singh",
                "grade": "Class 11-A",
                "risk_factor": "3 Consecutive Failed Practice Quizzes",
                "weak_topic": "Recursion Call Stack",
                "avg_mastery": 36,
            },
        ],
        "topic_difficulties": [
            {"topic": "Recursion & Backtracking", "subject": "DSA", "failure_rate": 42, "avg_score": 54},
            {"topic": "Database Normalization (3NF/BCNF)", "subject": "DBMS", "failure_rate": 35, "avg_score": 61},
            {"topic": "Virtual Memory & Paging", "subject": "OS", "failure_rate": 29, "avg_score": 68},
            {"topic": "Linked Lists & Pointers", "subject": "DSA", "failure_rate": 14, "avg_score": 86},
        ],
        "recent_assessments": [
            {"id": "a1", "title": "DSA Mid-Term Diagnostic", "submissions": 44, "avg_score": 74, "date": "Yesterday"},
            {"id": "a2", "title": "DBMS Relational Algebra Quiz", "submissions": 46, "avg_score": 81, "date": "3 days ago"},
        ],
    }
