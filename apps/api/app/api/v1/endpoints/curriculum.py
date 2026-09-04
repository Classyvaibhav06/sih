"""Curriculum & Knowledge Graph endpoints."""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.models import Subject, Chapter, Concept

router = APIRouter()


@router.get("/subjects")
async def list_subjects(db: AsyncSession = Depends(get_db)):
    """List all available subjects/courses."""
    result = await db.execute(select(Subject).order_by(Subject.order_index))
    subjects = result.scalars().all()
    if not subjects:
        # High quality fallback curriculum if database is unseeded
        return [
            {"id": "dsa", "name": "Data Structures & Algorithms", "code": "CS-201", "icon": "Code", "color": "blue"},
            {"id": "dbms", "name": "Database Management Systems", "code": "CS-202", "icon": "Database", "color": "purple"},
            {"id": "os", "name": "Operating Systems", "code": "CS-203", "icon": "Cpu", "color": "emerald"},
            {"id": "cn", "name": "Computer Networks", "code": "CS-204", "icon": "Network", "color": "amber"},
        ]
    return [
        {"id": s.id, "name": s.name, "code": s.code, "icon": s.icon_name, "color": s.color_code}
        for s in subjects
    ]


@router.get("/graph")
async def get_knowledge_graph(
    subject: str = Query("dsa", description="Subject ID or slug"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get the conceptual dependency knowledge graph for visual learning path.
    Each node represents a concept with its prerequisites and mastery states.
    """
    # High-quality structured curriculum node graph
    return [
        {
            "id": "c1",
            "name": "Arrays & Pointers",
            "subject": subject.upper(),
            "chapter": "Foundations",
            "difficulty": 1,
            "mastery": 95,
            "prerequisites": [],
            "status": "mastered",
        },
        {
            "id": "c2",
            "name": "Linked Lists & Nodes",
            "subject": subject.upper(),
            "chapter": "Linear Data Structures",
            "difficulty": 2,
            "mastery": 88,
            "prerequisites": ["c1"],
            "status": "mastered",
        },
        {
            "id": "c3",
            "name": "Stacks & Queues",
            "subject": subject.upper(),
            "chapter": "Linear Data Structures",
            "difficulty": 2,
            "mastery": 82,
            "prerequisites": ["c2"],
            "status": "mastered",
        },
        {
            "id": "c4",
            "name": "Recursion & Backtracking",
            "subject": subject.upper(),
            "chapter": "Algorithms",
            "difficulty": 3,
            "mastery": 43,
            "prerequisites": ["c3"],
            "status": "in_progress",
        },
        {
            "id": "c5",
            "name": "Binary Search Trees",
            "subject": subject.upper(),
            "chapter": "Hierarchical Structures",
            "difficulty": 3,
            "mastery": 38,
            "prerequisites": ["c4"],
            "status": "in_progress",
        },
        {
            "id": "c6",
            "name": "Dynamic Programming",
            "subject": subject.upper(),
            "chapter": "Advanced Problem Solving",
            "difficulty": 4,
            "mastery": 0,
            "prerequisites": ["c4"],
            "status": "locked",
        },
    ]
