"""API v1 router — registers all route groups."""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, students, teachers, parents, admin, ai, assessments, curriculum

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(students.router, prefix="/students", tags=["Students"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["Teachers"])
api_router.include_router(parents.router, prefix="/parents", tags=["Parents"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
api_router.include_router(assessments.router, prefix="/assessments", tags=["Assessments"])
api_router.include_router(curriculum.router, prefix="/curriculum", tags=["Curriculum"])
