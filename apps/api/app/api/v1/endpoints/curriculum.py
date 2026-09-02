"""Curriculum endpoint stubs."""
from fastapi import APIRouter
router = APIRouter()
@router.get("/")
async def list_curriculum(): return []
