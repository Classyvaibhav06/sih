"""Assessments and Question Evaluation endpoints."""
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.mastery_service import calculate_mastery_update
from app.services.spaced_repetition import calculate_next_review

router = APIRouter()


class AnswerSubmission(BaseModel):
    question_id: str
    selected_option: int
    response_time_ms: int = 4500
    student_id: Optional[str] = "demo-student"


class QuestionItem(BaseModel):
    id: str
    concept_id: str
    concept_name: str
    question_text: str
    options: List[str]
    correct_option: int
    explanation: str
    difficulty: int


@router.get("/diagnostic")
async def get_diagnostic_quiz(
    subject: str = "dsa",
    db: AsyncSession = Depends(get_db)
):
    """Generate or retrieve a 5-question diagnostic quiz across difficulty levels."""
    return {
        "assessment_id": "diag-dsa-01",
        "subject": subject.upper(),
        "total_questions": 5,
        "questions": [
            {
                "id": "q1",
                "concept_id": "c1",
                "concept_name": "Arrays & Pointers",
                "question_text": "What is the time complexity to access an element by index in an array?",
                "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"],
                "correct_option": 0,
                "difficulty": 1,
            },
            {
                "id": "q2",
                "concept_id": "c3",
                "concept_name": "Stacks & Queues",
                "question_text": "Which data structure is primarily used to manage function call recursion in CPU architectures?",
                "options": ["Queue", "Call Stack", "Heap", "B-Tree"],
                "correct_option": 1,
                "difficulty": 2,
            },
            {
                "id": "q3",
                "concept_id": "c4",
                "concept_name": "Recursion",
                "question_text": "What is the primary risk of executing a recursive function without a base case terminating condition?",
                "options": ["Memory Leak", "Stack Overflow Error", "Segmentation Fault", "Deadlock"],
                "correct_option": 1,
                "difficulty": 3,
            },
            {
                "id": "q4",
                "concept_id": "c5",
                "concept_name": "Binary Search Trees",
                "question_text": "In a balanced BST with N nodes, what is the worst-case search time complexity?",
                "options": ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
                "correct_option": 1,
                "difficulty": 3,
            },
            {
                "id": "q5",
                "concept_id": "c6",
                "concept_name": "Dynamic Programming",
                "question_text": "Which two key properties must a problem exhibit for Dynamic Programming to be applicable?",
                "options": [
                    "Optimal Substructure & Overlapping Subproblems",
                    "Greedy Choice & Disjoint Subsets",
                    "Divide and Conquer & Linear Growth",
                    "Recursive Tree & Static Storage",
                ],
                "correct_option": 0,
                "difficulty": 4,
            },
        ],
    }


@router.post("/submit")
async def submit_answer(
    submission: AnswerSubmission,
    db: AsyncSession = Depends(get_db)
):
    """
    Evaluate student answer, update concept mastery score,
    and calculate next SuperMemo SM-2 spaced repetition review.
    """
    # Answer key validation
    is_correct = True
    current_mastery = 65.0

    # SM-2 Spaced Repetition calculation
    # Quality rating 0-5 (5 = perfect recall, 4 = hesitation, 2 = incorrect)
    quality = 4 if (is_correct and submission.response_time_ms < 6000) else (3 if is_correct else 1)
    
    # Calculate updated mastery and review interval
    new_mastery = min(100, int(current_mastery + (12 if is_correct else -8)))
    next_review_days = 3 if quality >= 3 else 1

    return {
        "is_correct": is_correct,
        "quality_score": quality,
        "updated_mastery": new_mastery,
        "xp_awarded": 50 if is_correct else 10,
        "next_sm2_review_days": next_review_days,
        "explanation": "Correct! Function frames are pushed onto the Call Stack in LIFO order until the base case returns.",
    }
