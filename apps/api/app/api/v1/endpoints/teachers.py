"""Teacher endpoint stubs."""
from fastapi import APIRouter, Depends
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.get("/me/dashboard")
async def get_teacher_dashboard(db: AsyncSession = Depends(get_db)):
    return {"class": "12-A", "subject": "DSA", "students": 38, "at_risk": 5, "avg_mastery": 67}
