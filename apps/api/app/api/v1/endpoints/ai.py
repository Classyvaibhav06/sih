"""AI endpoints: tutor, question generation, explanation, study plan."""
import time
import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.config import settings
from app.services.ai_provider import get_ai_provider, ChatMessage

router = APIRouter()


# ─── Tutor ────────────────────────────────────────────────────────────────

class TutorMessage(BaseModel):
    role: str
    content: str


class TutorRequest(BaseModel):
    message: str
    context: Optional[dict] = None
    student_id: Optional[str] = None
    conversation_history: Optional[List[TutorMessage]] = None
    stream: bool = True
    language: str = "en"


SYSTEM_PROMPT_TEMPLATE = """You are AdaptiveX AI Tutor — an expert educational assistant.

Current Student Context:
- Course: {course}
- Topic: {topic}
- Current Mastery: {mastery}%
- Language preference: {language}
- Previous mistake: {mistake}

Your role:
1. Teach at the student's level (mastery: {mastery}%)
2. If mastery < 50%, use simple explanations with analogies
3. If mastery 50-75%, use guided practice approach
4. If mastery > 75%, use advanced examples and challenges
5. For practice questions, use Socratic method — guide thinking, don't give direct answers
6. Always cite which concept you're addressing
7. If uncertain, say "I'm not certain" rather than fabricating
8. Keep responses focused on the curriculum topic
9. Respond in {language} when requested

Important: You are grounded in the curriculum. Do not fabricate textbook references."""


@router.post("/tutor/chat")
async def tutor_chat(request: TutorRequest, db: AsyncSession = Depends(get_db)):
    """
    AI Tutor endpoint with streaming support.
    Uses student context to provide personalized responses.
    """
    provider = get_ai_provider()

    # Build system prompt with student context
    ctx = request.context or {}
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
        course=ctx.get("course", "General"),
        topic=ctx.get("topic", "Current topic"),
        mastery=ctx.get("mastery", 50),
        language=request.language,
        mistake=ctx.get("previousMistake", "None recorded"),
    )

    # Build message history
    messages = []
    for msg in (request.conversation_history or []):
        messages.append(ChatMessage(role=msg.role, content=msg.content))
    messages.append(ChatMessage(role="user", content=request.message))

    if request.stream:
        async def stream_response():
            start = time.time()
            total_content = ""
            try:
                async for chunk in provider.stream_chat(messages, system_prompt=system_prompt, temperature=0.7):
                    total_content += chunk
                    yield f"data: {json.dumps({'chunk': chunk, 'done': False})}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e), 'done': True})}\n\n"
                return

            # Send final metadata
            latency = int((time.time() - start) * 1000)
            yield f"data: {json.dumps({'chunk': '', 'done': True, 'provider': provider.provider_name, 'is_fallback': provider.provider_name == 'fallback', 'latency_ms': latency})}\n\n"

        return StreamingResponse(
            stream_response(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
            },
        )
    else:
        response = await provider.chat(messages, system_prompt=system_prompt)
        return {
            "content": response.content,
            "provider": response.provider,
            "is_fallback": response.is_fallback,
            "latency_ms": response.latency_ms,
        }


# ─── Question Generator ────────────────────────────────────────────────────

class QuestionGeneratorRequest(BaseModel):
    subject: str
    topic: str
    grade: str
    difficulty: str = "medium"
    count: int = 5
    question_types: List[str] = ["mcq"]
    language: str = "en"
    learning_objective: Optional[str] = None


@router.post("/questions/generate")
async def generate_questions(request: QuestionGeneratorRequest, db: AsyncSession = Depends(get_db)):
    """
    Generate assessment questions using AI.
    Returns structured question objects with answers and explanations.
    """
    provider = get_ai_provider()

    prompt = f"""Generate {request.count} educational questions for:
Subject: {request.subject}
Topic: {request.topic}  
Grade/Level: {request.grade}
Difficulty: {request.difficulty}
Question types: {', '.join(request.question_types)}
Language: {request.language}
{f'Learning objective: {request.learning_objective}' if request.learning_objective else ''}

Return ONLY a valid JSON array. Each question must have:
- question_text: string
- type: "mcq" | "true_false" | "fill_blank" | "short_answer"
- difficulty: "easy" | "medium" | "hard"
- options: array of objects with "id" and "text" (for mcq only)
- correct_answer: string
- explanation: string (2-3 sentences)
- concept: string (which concept this tests)
- learning_objective: string

Make questions educationally sound and curriculum-aligned."""

    messages = [ChatMessage(role="user", content=prompt)]
    response = await provider.chat(messages, temperature=0.4, max_tokens=2000)

    # Parse and validate output
    try:
        # Extract JSON from response
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]

        questions = json.loads(content.strip())

        return {
            "questions": questions,
            "generated_count": len(questions),
            "provider": response.provider,
            "is_fallback": response.is_fallback,
            "review_required": True,  # Always require teacher review
        }
    except json.JSONDecodeError:
        # Return a structured fallback if JSON parsing fails
        return {
            "questions": _fallback_questions(request.topic, request.difficulty, request.count),
            "generated_count": request.count,
            "provider": "fallback",
            "is_fallback": True,
            "review_required": True,
        }


def _fallback_questions(topic: str, difficulty: str, count: int) -> list:
    """Deterministic fallback questions for demo mode."""
    return [
        {
            "question_text": f"Which of the following best describes {topic}?",
            "type": "mcq",
            "difficulty": difficulty,
            "options": [
                {"id": "a", "text": "A common misconception about the concept"},
                {"id": "b", "text": f"The correct core principle of {topic}"},
                {"id": "c", "text": "A partially correct but incomplete answer"},
                {"id": "d", "text": "An unrelated concept from a different domain"},
            ],
            "correct_answer": "b",
            "explanation": f"The correct answer is B because it captures the fundamental principle of {topic}.",
            "concept": topic,
            "learning_objective": f"Understand the definition and purpose of {topic}",
        }
    ] * min(count, 3)


# ─── Explanation Engine ────────────────────────────────────────────────────

class ExplainRequest(BaseModel):
    concept: str
    student_answer: Optional[str] = None
    correct_answer: Optional[str] = None
    mastery_score: float = 50.0
    language: str = "en"


@router.post("/explain")
async def explain_concept(request: ExplainRequest, db: AsyncSession = Depends(get_db)):
    """
    AI explanation when student gets a question wrong.
    Identifies mistake, explains correct concept, gives example, asks follow-up.
    """
    provider = get_ai_provider()

    mistake_context = ""
    if request.student_answer and request.correct_answer:
        mistake_context = f"""
The student answered: "{request.student_answer}"
The correct answer is: "{request.correct_answer}"
Likely confusion point: identify what mistake they made based on these two answers.
"""

    prompt = f"""A student with mastery score {request.mastery_score}% got a question about "{request.concept}" wrong.
{mistake_context}

Provide a structured explanation following this exact format:

1. **What went wrong**: Identify the likely mistake or misconception
2. **The correct concept**: Explain clearly at the student's level ({request.mastery_score}% mastery)
3. **Simple example**: A concrete, relatable example
4. **Visual representation**: A simple text diagram or pseudocode if helpful
5. **Key takeaway**: One sentence summary
6. **Follow-up question**: Ask a similar but slightly different question to check understanding

Language: {request.language}
Keep total response concise but complete. Be encouraging, not condescending."""

    messages = [ChatMessage(role="user", content=prompt)]
    response = await provider.chat(messages, temperature=0.5)

    return {
        "explanation": response.content,
        "concept": request.concept,
        "provider": response.provider,
        "is_fallback": response.is_fallback,
    }


# ─── Study Plan ────────────────────────────────────────────────────────────

class StudyPlanRequest(BaseModel):
    student_id: str
    exam_date: str  # ISO date string
    exam_name: str
    daily_minutes: int = 60
    subjects: Optional[List[str]] = None


@router.post("/study-plan")
async def generate_study_plan(request: StudyPlanRequest, db: AsyncSession = Depends(get_db)):
    """Generate AI-powered study plan based on mastery scores and exam date."""
    # In real implementation, fetch actual mastery from DB
    # For demo, return a structured plan
    return {
        "exam_name": request.exam_name,
        "exam_date": request.exam_date,
        "total_days": 15,
        "daily_minutes": request.daily_minutes,
        "plan": [
            {
                "day": 1, "date": "2026-09-01",
                "focus": "Recursion fundamentals",
                "items": [
                    {"concept": "Recursion basics", "action": "learn", "minutes": 20, "mastery": 43, "priority": "high"},
                    {"concept": "Base cases", "action": "practice", "minutes": 20, "mastery": 43},
                    {"concept": "DBMS revision", "action": "revise", "minutes": 15, "mastery": 82},
                ],
            },
            {
                "day": 2, "date": "2026-09-02",
                "focus": "Tree traversals",
                "items": [
                    {"concept": "Binary trees intro", "action": "learn", "minutes": 25, "mastery": 38, "priority": "high"},
                    {"concept": "Inorder traversal", "action": "practice", "minutes": 20, "mastery": 38},
                    {"concept": "Arrays revision", "action": "revise", "minutes": 15, "mastery": 85},
                ],
            },
        ],
        "total_concepts": 24,
        "priority_concepts": ["Binary Trees", "Recursion", "OS Scheduling"],
        "provider": "fallback",
        "is_demo": True,
    }
