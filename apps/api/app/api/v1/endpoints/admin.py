"""Admin endpoint stubs."""
from fastapi import APIRouter
router = APIRouter()
@router.get("/stats")
async def get_stats(): return {"users": 120, "active": 98}
