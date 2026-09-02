"""Parent endpoint stubs."""
from fastapi import APIRouter
router = APIRouter()
@router.get("/me/children")
async def get_children(): return [{"id": "s1", "name": "Aarav Sharma"}]
