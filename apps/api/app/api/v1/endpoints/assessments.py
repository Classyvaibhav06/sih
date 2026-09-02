"""Assessments endpoint stubs."""
from fastapi import APIRouter
router = APIRouter()
@router.get("/")
async def list_assessments(): return []
