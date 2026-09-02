"""
AdaptiveX AI — Spaced Repetition Engine (SM-2 algorithm)
Schedules revision sessions to maximize long-term retention.

Algorithm: Modified SM-2
  - Quality: 0-5 scale derived from quiz performance
  - Ease factor: starts at 2.5, adjusts based on quality
  - Interval grows exponentially for well-remembered material
"""
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from dataclasses import dataclass
import math

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_

from app.models.models import RevisionItem, Concept, MasteryScore


@dataclass
class RevisionSchedule:
    concept_id: str
    concept_name: str
    due_at: datetime
    estimated_recall: float  # 0-1, labeled as "estimate"
    interval_days: float
    repetitions: int
    is_overdue: bool
    priority_score: float  # Higher = more urgent


class SpacedRepetitionEngine:
    """
    Manages revision scheduling using an SM-2 inspired algorithm.
    Every concept a student has learned gets a revision schedule.
    """

    MIN_EASE = 1.3
    MAX_EASE = 3.5
    INITIAL_EASE = 2.5

    def __init__(self, db: AsyncSession):
        self.db = db

    def _quality_from_mastery(self, mastery_score: float, is_correct: bool) -> int:
        """
        Convert mastery score + correctness to SM-2 quality (0-5).
        """
        if not is_correct:
            return 1 if mastery_score < 50 else 2
        if mastery_score >= 90:
            return 5
        elif mastery_score >= 75:
            return 4
        elif mastery_score >= 60:
            return 3
        else:
            return 2

    def _next_interval(
        self,
        repetitions: int,
        ease_factor: float,
        quality: int,
        current_interval: float,
    ) -> tuple[float, float, int]:
        """
        SM-2 algorithm.
        Returns: (new_interval_days, new_ease_factor, new_repetitions)
        """
        if quality < 3:
            # Failed — reset to beginning
            new_interval = 1.0
            new_repetitions = 0
        elif repetitions == 0:
            new_interval = 1.0
            new_repetitions = 1
        elif repetitions == 1:
            new_interval = 6.0
            new_repetitions = 2
        else:
            new_interval = current_interval * ease_factor
            new_repetitions = repetitions + 1

        # Adjust ease factor
        new_ease = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        new_ease = max(self.MIN_EASE, min(self.MAX_EASE, new_ease))

        return new_interval, new_ease, new_repetitions

    async def create_revision_item(
        self,
        student_id: str,
        concept_id: str,
        initial_mastery: float = 70.0,
    ) -> RevisionItem:
        """Create initial revision schedule when a concept is first learned."""
        # Check if already exists
        existing = await self.db.execute(
            select(RevisionItem).where(
                and_(
                    RevisionItem.student_id == student_id,
                    RevisionItem.concept_id == concept_id,
                )
            )
        )
        item = existing.scalar_one_or_none()

        if item:
            return item

        # Initial: due in 1 day
        due_at = datetime.now(timezone.utc) + timedelta(days=1)

        item = RevisionItem(
            student_id=student_id,
            concept_id=concept_id,
            due_at=due_at,
            interval_days=1.0,
            ease_factor=self.INITIAL_EASE,
            repetitions=0,
            estimated_recall=1.0,
            is_completed=False,
        )
        self.db.add(item)
        await self.db.flush()
        return item

    async def update_after_review(
        self,
        student_id: str,
        concept_id: str,
        mastery_score: float,
        is_correct: bool,
    ) -> RevisionItem:
        """Update the revision schedule after a student reviews a concept."""
        result = await self.db.execute(
            select(RevisionItem).where(
                and_(
                    RevisionItem.student_id == student_id,
                    RevisionItem.concept_id == concept_id,
                )
            )
        )
        item = result.scalar_one_or_none()

        if not item:
            item = await self.create_revision_item(student_id, concept_id, mastery_score)

        quality = self._quality_from_mastery(mastery_score, is_correct)
        new_interval, new_ease, new_reps = self._next_interval(
            item.repetitions,
            item.ease_factor,
            quality,
            item.interval_days,
        )

        item.interval_days = new_interval
        item.ease_factor = new_ease
        item.repetitions = new_reps
        item.last_reviewed_at = datetime.now(timezone.utc)
        item.due_at = datetime.now(timezone.utc) + timedelta(days=new_interval)

        # Update estimated recall (honest estimate, not guaranteed)
        stability = (mastery_score / 100) * new_ease
        item.estimated_recall = math.exp(-1.0 / max(stability, 0.1))

        await self.db.flush()
        return item

    async def get_due_revisions(
        self,
        student_id: str,
        limit: int = 20,
    ) -> List[RevisionSchedule]:
        """Get concepts due for revision today."""
        now = datetime.now(timezone.utc)
        tomorrow = now + timedelta(days=1)

        stmt = (
            select(RevisionItem, Concept)
            .join(Concept, RevisionItem.concept_id == Concept.id)
            .where(
                and_(
                    RevisionItem.student_id == student_id,
                    RevisionItem.due_at <= tomorrow,
                    RevisionItem.is_completed == False,
                )
            )
            .order_by(RevisionItem.due_at.asc())
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        rows = result.all()

        schedules = []
        for item, concept in rows:
            days_overdue = (now - item.due_at).days
            priority = 1.0 + (max(0, days_overdue) * 0.5) + (1.0 - item.estimated_recall)

            schedules.append(RevisionSchedule(
                concept_id=concept.id,
                concept_name=concept.name,
                due_at=item.due_at,
                estimated_recall=item.estimated_recall,
                interval_days=item.interval_days,
                repetitions=item.repetitions,
                is_overdue=item.due_at < now,
                priority_score=priority,
            ))

        return sorted(schedules, key=lambda x: x.priority_score, reverse=True)

    async def generate_study_plan(
        self,
        student_id: str,
        exam_date: datetime,
        daily_minutes: int = 60,
    ) -> List[dict]:
        """
        Generate a day-by-day study plan until the exam.
        Incorporates mastery scores and revision schedules.
        """
        days_until_exam = (exam_date - datetime.now(timezone.utc)).days
        if days_until_exam <= 0:
            return []

        # Get all mastery scores ordered by urgency
        mastery_stmt = (
            select(MasteryScore, Concept)
            .join(Concept, MasteryScore.concept_id == Concept.id)
            .where(MasteryScore.student_id == student_id)
            .order_by(MasteryScore.mastery_score.asc())
        )
        result = await self.db.execute(mastery_stmt)
        mastery_rows = result.all()

        plan = []
        for day in range(min(days_until_exam, 30)):  # Max 30-day plan
            study_date = datetime.now(timezone.utc) + timedelta(days=day)
            day_minutes = daily_minutes
            day_items = []

            # Prioritize weak concepts, then revision, then normal
            for ms, concept in mastery_rows:
                if day_minutes <= 0:
                    break
                if ms.mastery_score < 65:
                    minutes = min(25, day_minutes)
                    action = "practice" if ms.mastery_score > 40 else "learn"
                    day_items.append({
                        "concept_id": concept.id,
                        "concept_name": concept.name,
                        "action": action,
                        "minutes": minutes,
                        "mastery": ms.mastery_score,
                        "reason": f"Mastery: {ms.mastery_score:.0f}% — needs attention",
                    })
                    day_minutes -= minutes

            plan.append({
                "day": day + 1,
                "date": study_date.date().isoformat(),
                "total_minutes": daily_minutes - day_minutes,
                "items": day_items,
            })

        return plan
