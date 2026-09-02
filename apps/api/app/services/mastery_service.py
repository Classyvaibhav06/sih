"""
AdaptiveX AI — Mastery Engine
The core adaptive learning algorithm.

Mastery Score Calculation:
  mastery = 0.35 * recent_accuracy
           + 0.20 * historical_accuracy
           + 0.20 * difficulty_adjusted_score
           + 0.15 * recency_factor
           + 0.10 * consistency_score

Score range: 0–100
Confidence: 0–1 (certainty of the score based on data volume)
"""
import math
from datetime import datetime, timedelta, timezone
from typing import List, Optional, Dict, Tuple
from dataclasses import dataclass

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.models.models import (
    MasteryScore, QuestionAttempt, StudentAttempt,
    Question, Concept, RevisionItem, LearningPathItem,
    DifficultyLevel
)


# ─── Difficulty weight multipliers ───────────────────────────────────────
DIFFICULTY_WEIGHTS = {
    DifficultyLevel.beginner: 0.6,
    DifficultyLevel.easy: 0.8,
    DifficultyLevel.medium: 1.0,
    DifficultyLevel.hard: 1.3,
    DifficultyLevel.advanced: 1.6,
}

# ─── Mastery thresholds ───────────────────────────────────────────────────
MASTERY_FOUNDATIONAL = 40   # < 40: needs foundational lesson
MASTERY_GUIDED = 65          # 40-65: guided practice
MASTERY_PRACTICE = 85        # 65-85: regular practice
MASTERY_ADVANCED = 100       # > 85: advanced challenge / move on

# ─── Forgetting curve constants (Ebbinghaus-inspired) ─────────────────────
FORGETTING_STABILITY = 1.0   # Adjusted per SM-2 ease factor


@dataclass
class MasteryUpdate:
    """Result of a mastery recalculation."""
    concept_id: str
    old_score: float
    new_score: float
    confidence: float
    delta: float
    reason: str
    recommendation: str


@dataclass
class WeakConcept:
    concept_id: str
    concept_name: str
    topic_name: str
    mastery_score: float
    total_attempts: int
    recent_accuracy: float
    reason: str  # Explainable AI — why is it weak?


class MasteryService:
    """
    Calculates and updates student mastery scores for concepts.
    This is the heart of the adaptive learning engine.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def calculate_mastery(
        self,
        student_id: str,
        concept_id: str,
    ) -> Tuple[float, float]:
        """
        Recalculate mastery from all stored question attempts.
        Returns: (mastery_score 0-100, confidence 0-1)
        """
        # Fetch all question attempts for this concept
        stmt = (
            select(QuestionAttempt, Question)
            .join(Question, QuestionAttempt.question_id == Question.id)
            .join(StudentAttempt, QuestionAttempt.attempt_id == StudentAttempt.id)
            .where(
                and_(
                    StudentAttempt.student_id == student_id,
                    Question.concept_id == concept_id,
                    QuestionAttempt.is_skipped == False,
                )
            )
            .order_by(QuestionAttempt.answered_at.asc())
        )
        result = await self.db.execute(stmt)
        rows = result.all()

        if not rows:
            return 0.0, 0.0

        attempts = [(qa, q) for qa, q in rows]
        total = len(attempts)

        # ── Recent accuracy (last 10 attempts, weighted toward latest) ──
        recent = attempts[-10:]
        recent_weights = [0.5 + (i / len(recent)) * 0.5 for i in range(len(recent))]
        recent_score = sum(
            w * (1.0 if qa.is_correct else 0.0)
            for (qa, _), w in zip(recent, recent_weights)
        ) / sum(recent_weights) if recent_weights else 0.0

        # ── Historical accuracy (all time) ──
        historical_score = sum(1 for qa, _ in attempts if qa.is_correct) / total

        # ── Difficulty-adjusted score ──
        diff_scores = []
        for qa, q in attempts:
            weight = DIFFICULTY_WEIGHTS.get(q.difficulty, 1.0)
            diff_scores.append(weight * (1.0 if qa.is_correct else 0.0))
        difficulty_adjusted = sum(diff_scores) / (sum(DIFFICULTY_WEIGHTS.values()) / len(DIFFICULTY_WEIGHTS)) / total

        # ── Recency factor (decay based on time since last attempt) ──
        last_attempt = attempts[-1][0]
        if last_attempt.answered_at:
            hours_since = (datetime.now(timezone.utc) - last_attempt.answered_at).total_seconds() / 3600
            recency_factor = math.exp(-0.005 * hours_since)  # slow decay
        else:
            recency_factor = 0.5

        # ── Consistency score (std deviation of last 5 attempts) ──
        recent5 = [1.0 if qa.is_correct else 0.0 for qa, _ in attempts[-5:]]
        if len(recent5) >= 2:
            mean5 = sum(recent5) / len(recent5)
            variance = sum((x - mean5) ** 2 for x in recent5) / len(recent5)
            std_dev = math.sqrt(variance)
            consistency = 1.0 - min(std_dev, 1.0)
        else:
            consistency = 0.5

        # ── Response time efficiency ──
        times = [qa.response_time_seconds for qa, _ in recent if qa.response_time_seconds]
        if times:
            avg_time = sum(times) / len(times)
            # Faster correct answers → higher efficiency (cap at 30s for full score)
            time_efficiency = max(0.0, 1.0 - (avg_time - 10) / 60) if avg_time > 10 else 1.0
        else:
            time_efficiency = 0.5

        # ── Final weighted mastery ──
        raw_mastery = (
            0.35 * recent_score
            + 0.20 * historical_score
            + 0.20 * min(difficulty_adjusted, 1.0)
            + 0.15 * recency_factor
            + 0.10 * consistency
        ) * 100

        mastery = min(100.0, max(0.0, raw_mastery))

        # ── Confidence grows with more attempts ──
        confidence = min(1.0, total / 20)  # Full confidence at 20+ attempts

        return round(mastery, 2), round(confidence, 3)

    async def update_mastery_from_attempt(
        self,
        student_id: str,
        attempt_id: str,
    ) -> List[MasteryUpdate]:
        """
        Called after each assessment completion.
        Recalculates mastery for all concepts touched in the attempt.
        Returns list of MasteryUpdate objects for event-driven path updates.
        """
        # Get all question attempts with their concepts
        stmt = (
            select(QuestionAttempt, Question)
            .join(Question, QuestionAttempt.question_id == Question.id)
            .where(QuestionAttempt.attempt_id == attempt_id)
        )
        result = await self.db.execute(stmt)
        rows = result.all()

        # Group by concept
        concept_ids = set(q.concept_id for _, q in rows if q.concept_id)
        updates = []

        for concept_id in concept_ids:
            # Get current score
            existing = await self.db.execute(
                select(MasteryScore).where(
                    and_(
                        MasteryScore.student_id == student_id,
                        MasteryScore.concept_id == concept_id,
                    )
                )
            )
            current = existing.scalar_one_or_none()
            old_score = current.mastery_score if current else 0.0

            # Recalculate
            new_score, confidence = await self.calculate_mastery(student_id, concept_id)

            # Upsert
            if current:
                current.mastery_score = new_score
                current.confidence = confidence
                current.last_assessed_at = datetime.now(timezone.utc)
                # Update component scores
                q_attempts = [(qa, q) for qa, q in rows if q.concept_id == concept_id]
                if q_attempts:
                    recent = [qa for qa, _ in q_attempts[-5:]]
                    current.recent_accuracy = sum(1 for qa in recent if qa.is_correct) / len(recent)
                    all_ = [qa for qa, _ in rows if True]
                    current.total_attempts = len(all_)
                    current.correct_attempts = sum(1 for qa in all_ if qa.is_correct)
            else:
                q_attempts = [(qa, q) for qa, q in rows if q.concept_id == concept_id]
                recent_acc = 0.0
                if q_attempts:
                    recent = [qa for qa, _ in q_attempts[-5:]]
                    recent_acc = sum(1 for qa in recent if qa.is_correct) / len(recent)

                current = MasteryScore(
                    student_id=student_id,
                    concept_id=concept_id,
                    mastery_score=new_score,
                    confidence=confidence,
                    recent_accuracy=recent_acc,
                    total_attempts=len(q_attempts),
                    correct_attempts=sum(1 for qa, _ in q_attempts if qa.is_correct),
                    last_assessed_at=datetime.now(timezone.utc),
                )
                self.db.add(current)

            delta = new_score - old_score
            recommendation = self._get_recommendation(new_score)

            updates.append(MasteryUpdate(
                concept_id=concept_id,
                old_score=old_score,
                new_score=new_score,
                confidence=confidence,
                delta=delta,
                reason=self._explain_score(new_score, delta),
                recommendation=recommendation,
            ))

        await self.db.flush()
        return updates

    async def get_weak_concepts(
        self,
        student_id: str,
        threshold: float = 65.0,
        limit: int = 10,
    ) -> List[WeakConcept]:
        """Returns concepts where mastery is below threshold, with explanations."""
        stmt = (
            select(MasteryScore, Concept)
            .join(Concept, MasteryScore.concept_id == Concept.id)
            .where(
                and_(
                    MasteryScore.student_id == student_id,
                    MasteryScore.mastery_score < threshold,
                )
            )
            .order_by(MasteryScore.mastery_score.asc())
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        rows = result.all()

        weak = []
        for ms, concept in rows:
            reason = self._build_weakness_reason(ms)
            weak.append(WeakConcept(
                concept_id=concept.id,
                concept_name=concept.name,
                topic_name="",  # enriched by caller
                mastery_score=ms.mastery_score,
                total_attempts=ms.total_attempts,
                recent_accuracy=ms.recent_accuracy,
                reason=reason,
            ))
        return weak

    async def get_strong_concepts(
        self,
        student_id: str,
        threshold: float = 85.0,
        limit: int = 10,
    ) -> List[Dict]:
        """Returns concepts where mastery is above threshold."""
        stmt = (
            select(MasteryScore, Concept)
            .join(Concept, MasteryScore.concept_id == Concept.id)
            .where(
                and_(
                    MasteryScore.student_id == student_id,
                    MasteryScore.mastery_score >= threshold,
                )
            )
            .order_by(MasteryScore.mastery_score.desc())
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        rows = result.all()
        return [
            {"concept_id": c.id, "concept_name": c.name, "mastery_score": ms.mastery_score}
            for ms, c in rows
        ]

    def estimate_forgetting(
        self,
        mastery_score: float,
        ease_factor: float,
        days_since_last_review: float,
    ) -> float:
        """
        Estimate recall probability using an Ebbinghaus-inspired forgetting curve.
        Returns: estimated recall 0.0–1.0
        """
        if days_since_last_review <= 0:
            return 1.0
        # Stability scales with mastery and ease factor
        stability = (mastery_score / 100) * ease_factor * FORGETTING_STABILITY
        recall = math.exp(-days_since_last_review / max(stability, 0.1))
        return max(0.0, min(1.0, recall))

    def _get_recommendation(self, score: float) -> str:
        if score < MASTERY_FOUNDATIONAL:
            return "foundational_lesson"
        elif score < MASTERY_GUIDED:
            return "guided_practice"
        elif score < MASTERY_PRACTICE:
            return "regular_practice"
        else:
            return "advanced_challenge"

    def _explain_score(self, score: float, delta: float) -> str:
        direction = "improved" if delta > 0 else "decreased" if delta < 0 else "unchanged"
        if score < MASTERY_FOUNDATIONAL:
            return f"Mastery {direction} to {score:.0f}%. Core concepts need review."
        elif score < MASTERY_GUIDED:
            return f"Mastery {direction} to {score:.0f}%. Guided practice recommended."
        elif score < MASTERY_PRACTICE:
            return f"Mastery {direction} to {score:.0f}%. On track, keep practicing."
        else:
            return f"Excellent! Mastery {direction} to {score:.0f}%. Ready for advanced topics."

    def _build_weakness_reason(self, ms: MasteryScore) -> str:
        reasons = []
        if ms.recent_accuracy < 0.4:
            reasons.append(f"recent accuracy only {ms.recent_accuracy * 100:.0f}%")
        if ms.total_attempts < 5:
            reasons.append("limited practice attempts")
        if ms.total_attempts > 0 and (ms.correct_attempts / ms.total_attempts) < 0.5:
            reasons.append(f"{ms.correct_attempts}/{ms.total_attempts} correct overall")
        if not reasons:
            reasons.append(f"mastery score {ms.mastery_score:.0f}% below threshold")
        return "Identified as weak because: " + ", ".join(reasons)
