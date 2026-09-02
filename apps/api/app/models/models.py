"""
AdaptiveX AI — Complete Database Models
All 35+ tables for the adaptive learning platform
"""
import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum
from typing import List, Optional

from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey, Integer,
    String, Text, JSON, Enum, UniqueConstraint, Index,
    func, text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


def gen_uuid():
    return str(uuid.uuid4())


# ─────────────────────────────────────────────
# ENUMS
# ─────────────────────────────────────────────

class UserRole(str, PyEnum):
    student = "student"
    teacher = "teacher"
    parent = "parent"
    institution_admin = "institution_admin"
    platform_admin = "platform_admin"


class LearningMode(str, PyEnum):
    visual = "visual"
    reading = "reading"
    practice = "practice"
    auditory = "auditory"
    mixed = "mixed"


class DifficultyLevel(str, PyEnum):
    beginner = "beginner"
    easy = "easy"
    medium = "medium"
    hard = "hard"
    advanced = "advanced"


class ResourceType(str, PyEnum):
    video = "video"
    article = "article"
    pdf = "pdf"
    interactive = "interactive"
    code = "code"
    quiz = "quiz"
    flashcard = "flashcard"


class AssessmentType(str, PyEnum):
    diagnostic = "diagnostic"
    formative = "formative"
    summative = "summative"
    practice = "practice"
    ai_generated = "ai_generated"


class QuestionType(str, PyEnum):
    mcq = "mcq"
    multi_select = "multi_select"
    true_false = "true_false"
    fill_blank = "fill_blank"
    short_answer = "short_answer"
    descriptive = "descriptive"
    coding = "coding"


class LearningEventType(str, PyEnum):
    lesson_started = "lesson_started"
    lesson_completed = "lesson_completed"
    question_answered = "question_answered"
    quiz_started = "quiz_started"
    quiz_completed = "quiz_completed"
    resource_opened = "resource_opened"
    tutor_question = "tutor_question"
    revision_completed = "revision_completed"
    goal_completed = "goal_completed"
    login = "login"
    diagnostic_completed = "diagnostic_completed"


class PathItemStatus(str, PyEnum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"
    skipped = "skipped"
    recommended = "recommended"


class InstitutionType(str, PyEnum):
    school = "school"
    college = "college"
    coaching = "coaching"
    university = "university"
    corporate = "corporate"


class NotificationType(str, PyEnum):
    revision_due = "revision_due"
    assignment_due = "assignment_due"
    new_assignment = "new_assignment"
    goal_achieved = "goal_achieved"
    mastery_improved = "mastery_improved"
    at_risk = "at_risk"
    system = "system"
    weekly_report = "weekly_report"


# ─────────────────────────────────────────────
# USERS & AUTH
# ─────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255))
    auth_provider: Mapped[Optional[str]] = mapped_column(String(50))  # google, github
    auth_provider_id: Mapped[Optional[str]] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False, default=UserRole.student)
    language: Mapped[str] = mapped_column(String(10), default="en")
    timezone: Mapped[str] = mapped_column(String(50), default="Asia/Kolkata")
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    onboarding_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    # Relationships
    student_profile: Mapped[Optional["StudentProfile"]] = relationship(back_populates="user", uselist=False)
    teacher_profile: Mapped[Optional["TeacherProfile"]] = relationship(back_populates="user", uselist=False)
    parent_profile: Mapped[Optional["ParentProfile"]] = relationship(back_populates="user", uselist=False)
    notifications: Mapped[List["Notification"]] = relationship(back_populates="user")
    learning_events: Mapped[List["LearningEvent"]] = relationship(back_populates="user")
    ai_interactions: Mapped[List["AIInteraction"]] = relationship(back_populates="user")

    __table_args__ = (
        Index("ix_users_email_role", "email", "role"),
    )


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    institution_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("institutions.id"))
    grade: Mapped[Optional[str]] = mapped_column(String(20))
    board: Mapped[Optional[str]] = mapped_column(String(50))  # CBSE, ICSE, etc.
    learning_goal: Mapped[Optional[str]] = mapped_column(Text)
    preferred_language: Mapped[str] = mapped_column(String(10), default="en")
    preferred_learning_mode: Mapped[LearningMode] = mapped_column(Enum(LearningMode), default=LearningMode.mixed)
    current_level: Mapped[Optional[str]] = mapped_column(String(20))
    daily_study_minutes: Mapped[int] = mapped_column(Integer, default=60)
    streak_count: Mapped[int] = mapped_column(Integer, default=0)
    total_xp: Mapped[int] = mapped_column(Integer, default=0)
    level: Mapped[int] = mapped_column(Integer, default=1)
    last_active_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    diagnostic_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship(back_populates="student_profile")
    institution: Mapped[Optional["Institution"]] = relationship()
    mastery_scores: Mapped[List["MasteryScore"]] = relationship(back_populates="student")
    learning_paths: Mapped[List["LearningPath"]] = relationship(back_populates="student")
    revision_items: Mapped[List["RevisionItem"]] = relationship(back_populates="student")
    attempts: Mapped[List["StudentAttempt"]] = relationship(back_populates="student")
    goals: Mapped[List["Goal"]] = relationship(back_populates="student")
    achievements: Mapped[List["StudentAchievement"]] = relationship(back_populates="student")
    class_enrollments: Mapped[List["ClassStudent"]] = relationship(back_populates="student")


class TeacherProfile(Base):
    __tablename__ = "teacher_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    institution_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("institutions.id"))
    specialization: Mapped[Optional[str]] = mapped_column(String(255))
    experience_years: Mapped[Optional[int]] = mapped_column(Integer)

    user: Mapped["User"] = relationship(back_populates="teacher_profile")
    classes: Mapped[List["Class"]] = relationship(back_populates="teacher")


class ParentProfile(Base):
    __tablename__ = "parent_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True)

    user: Mapped["User"] = relationship(back_populates="parent_profile")
    children_links: Mapped[List["ParentStudentLink"]] = relationship(back_populates="parent")


class ParentStudentLink(Base):
    __tablename__ = "parent_student_links"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    parent_id: Mapped[str] = mapped_column(String(36), ForeignKey("parent_profiles.id", ondelete="CASCADE"))
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("student_profiles.id", ondelete="CASCADE"))
    relationship_type: Mapped[str] = mapped_column(String(50), default="parent")

    parent: Mapped["ParentProfile"] = relationship(back_populates="children_links")
    student: Mapped["StudentProfile"] = relationship()

    __table_args__ = (UniqueConstraint("parent_id", "student_id"),)


# ─────────────────────────────────────────────
# INSTITUTIONS & CLASSES
# ─────────────────────────────────────────────

class Institution(Base):
    __tablename__ = "institutions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[InstitutionType] = mapped_column(Enum(InstitutionType), default=InstitutionType.school)
    location: Mapped[Optional[str]] = mapped_column(String(255))
    state: Mapped[Optional[str]] = mapped_column(String(100))
    country: Mapped[str] = mapped_column(String(100), default="India")
    logo_url: Mapped[Optional[str]] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    classes: Mapped[List["Class"]] = relationship(back_populates="institution")


class Class(Base):
    __tablename__ = "classes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    institution_id: Mapped[str] = mapped_column(String(36), ForeignKey("institutions.id"))
    teacher_id: Mapped[str] = mapped_column(String(36), ForeignKey("teacher_profiles.id"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    grade: Mapped[Optional[str]] = mapped_column(String(20))
    section: Mapped[Optional[str]] = mapped_column(String(10))
    academic_year: Mapped[str] = mapped_column(String(10), default="2024-25")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    institution: Mapped["Institution"] = relationship(back_populates="classes")
    teacher: Mapped["TeacherProfile"] = relationship(back_populates="classes")
    students: Mapped[List["ClassStudent"]] = relationship(back_populates="class_")
    assessments: Mapped[List["Assessment"]] = relationship(back_populates="class_")


class ClassStudent(Base):
    __tablename__ = "class_students"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    class_id: Mapped[str] = mapped_column(String(36), ForeignKey("classes.id", ondelete="CASCADE"))
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("student_profiles.id", ondelete="CASCADE"))
    enrolled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    class_: Mapped["Class"] = relationship(back_populates="students")
    student: Mapped["StudentProfile"] = relationship(back_populates="class_enrollments")

    __table_args__ = (UniqueConstraint("class_id", "student_id"),)


# ─────────────────────────────────────────────
# CURRICULUM: Subject → Course → Topic → Concept
# ─────────────────────────────────────────────

class Subject(Base):
    __tablename__ = "subjects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    icon: Mapped[Optional[str]] = mapped_column(String(50))
    color: Mapped[Optional[str]] = mapped_column(String(20))

    courses: Mapped[List["Course"]] = relationship(back_populates="subject")


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    subject_id: Mapped[str] = mapped_column(String(36), ForeignKey("subjects.id"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    grade: Mapped[Optional[str]] = mapped_column(String(20))
    board: Mapped[Optional[str]] = mapped_column(String(50))
    curriculum: Mapped[Optional[str]] = mapped_column(String(100))
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500))
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    subject: Mapped["Subject"] = relationship(back_populates="courses")
    topics: Mapped[List["Topic"]] = relationship(back_populates="course")
    assessments: Mapped[List["Assessment"]] = relationship(back_populates="course")


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("courses.id"))
    parent_topic_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("topics.id"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    difficulty: Mapped[DifficultyLevel] = mapped_column(Enum(DifficultyLevel), default=DifficultyLevel.medium)
    sequence: Mapped[int] = mapped_column(Integer, default=0)
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=30)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500))

    course: Mapped["Course"] = relationship(back_populates="topics")
    parent: Mapped[Optional["Topic"]] = relationship(remote_side="Topic.id", foreign_keys=[parent_topic_id])
    subtopics: Mapped[List["Topic"]] = relationship(foreign_keys=[parent_topic_id])
    concepts: Mapped[List["Concept"]] = relationship(back_populates="topic")
    resources: Mapped[List["LearningResource"]] = relationship(back_populates="topic")

    __table_args__ = (Index("ix_topics_course_seq", "course_id", "sequence"),)


class Concept(Base):
    __tablename__ = "concepts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    topic_id: Mapped[str] = mapped_column(String(36), ForeignKey("topics.id"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    difficulty: Mapped[DifficultyLevel] = mapped_column(Enum(DifficultyLevel), default=DifficultyLevel.medium)
    sequence: Mapped[int] = mapped_column(Integer, default=0)
    importance_score: Mapped[float] = mapped_column(Float, default=1.0)  # 0-1 weight for path planning

    topic: Mapped["Topic"] = relationship(back_populates="concepts")
    prerequisites: Mapped[List["ConceptPrerequisite"]] = relationship(
        foreign_keys="ConceptPrerequisite.concept_id", back_populates="concept"
    )
    questions: Mapped[List["Question"]] = relationship(back_populates="concept")
    mastery_scores: Mapped[List["MasteryScore"]] = relationship(back_populates="concept")
    path_items: Mapped[List["LearningPathItem"]] = relationship(back_populates="concept")
    revision_items: Mapped[List["RevisionItem"]] = relationship(back_populates="concept")


class ConceptPrerequisite(Base):
    """Knowledge graph edges: concept requires prerequisite."""
    __tablename__ = "concept_prerequisites"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    concept_id: Mapped[str] = mapped_column(String(36), ForeignKey("concepts.id"))
    prerequisite_id: Mapped[str] = mapped_column(String(36), ForeignKey("concepts.id"))
    strength: Mapped[float] = mapped_column(Float, default=1.0)  # How strongly required

    concept: Mapped["Concept"] = relationship(foreign_keys=[concept_id], back_populates="prerequisites")
    prerequisite: Mapped["Concept"] = relationship(foreign_keys=[prerequisite_id])

    __table_args__ = (UniqueConstraint("concept_id", "prerequisite_id"),)


# ─────────────────────────────────────────────
# LEARNING RESOURCES
# ─────────────────────────────────────────────

class LearningResource(Base):
    __tablename__ = "learning_resources"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    topic_id: Mapped[str] = mapped_column(String(36), ForeignKey("topics.id"))
    type: Mapped[ResourceType] = mapped_column(Enum(ResourceType))
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    content_url: Mapped[Optional[str]] = mapped_column(String(1000))
    text_content: Mapped[Optional[str]] = mapped_column(Text)
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer)
    difficulty: Mapped[DifficultyLevel] = mapped_column(Enum(DifficultyLevel), default=DifficultyLevel.medium)
    language: Mapped[str] = mapped_column(String(10), default="en")
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    is_ai_generated: Mapped[bool] = mapped_column(Boolean, default=False)
    created_by_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    topic: Mapped["Topic"] = relationship(back_populates="resources")


# ─────────────────────────────────────────────
# ASSESSMENTS & QUESTIONS
# ─────────────────────────────────────────────

class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    course_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("courses.id"))
    class_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("classes.id"))
    created_by_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    type: Mapped[AssessmentType] = mapped_column(Enum(AssessmentType))
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer)
    is_adaptive: Mapped[bool] = mapped_column(Boolean, default=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    is_ai_generated: Mapped[bool] = mapped_column(Boolean, default=False)
    due_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    course: Mapped[Optional["Course"]] = relationship(back_populates="assessments")
    class_: Mapped[Optional["Class"]] = relationship(back_populates="assessments")
    questions: Mapped[List["Question"]] = relationship(back_populates="assessment")
    attempts: Mapped[List["StudentAttempt"]] = relationship(back_populates="assessment")


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    assessment_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("assessments.id"))
    concept_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("concepts.id"))
    type: Mapped[QuestionType] = mapped_column(Enum(QuestionType))
    difficulty: Mapped[DifficultyLevel] = mapped_column(Enum(DifficultyLevel))
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[Optional[dict]] = mapped_column(JSON)  # For MCQ: [{"id": "a", "text": "..."}]
    correct_answer: Mapped[str] = mapped_column(Text, nullable=False)
    explanation: Mapped[Optional[str]] = mapped_column(Text)
    hint: Mapped[Optional[str]] = mapped_column(Text)
    learning_objective: Mapped[Optional[str]] = mapped_column(Text)
    marks: Mapped[float] = mapped_column(Float, default=1.0)
    negative_marks: Mapped[float] = mapped_column(Float, default=0.0)
    sequence: Mapped[int] = mapped_column(Integer, default=0)
    language: Mapped[str] = mapped_column(String(10), default="en")
    is_ai_generated: Mapped[bool] = mapped_column(Boolean, default=False)
    tags: Mapped[Optional[list]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    assessment: Mapped[Optional["Assessment"]] = relationship(back_populates="questions")
    concept: Mapped[Optional["Concept"]] = relationship(back_populates="questions")
    attempts: Mapped[List["QuestionAttempt"]] = relationship(back_populates="question")


# ─────────────────────────────────────────────
# STUDENT ATTEMPTS & PERFORMANCE
# ─────────────────────────────────────────────

class StudentAttempt(Base):
    __tablename__ = "student_attempts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("student_profiles.id"))
    assessment_id: Mapped[str] = mapped_column(String(36), ForeignKey("assessments.id"))
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    score: Mapped[Optional[float]] = mapped_column(Float)
    max_score: Mapped[Optional[float]] = mapped_column(Float)
    percentage: Mapped[Optional[float]] = mapped_column(Float)
    time_taken_seconds: Mapped[Optional[int]] = mapped_column(Integer)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    student: Mapped["StudentProfile"] = relationship(back_populates="attempts")
    assessment: Mapped["Assessment"] = relationship(back_populates="attempts")
    question_attempts: Mapped[List["QuestionAttempt"]] = relationship(back_populates="attempt")

    __table_args__ = (Index("ix_student_attempts_student", "student_id", "assessment_id"),)


class QuestionAttempt(Base):
    __tablename__ = "question_attempts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    attempt_id: Mapped[str] = mapped_column(String(36), ForeignKey("student_attempts.id"))
    question_id: Mapped[str] = mapped_column(String(36), ForeignKey("questions.id"))
    selected_answer: Mapped[Optional[str]] = mapped_column(Text)
    is_correct: Mapped[Optional[bool]] = mapped_column(Boolean)
    is_skipped: Mapped[bool] = mapped_column(Boolean, default=False)
    response_time_seconds: Mapped[Optional[int]] = mapped_column(Integer)
    hint_used: Mapped[bool] = mapped_column(Boolean, default=False)
    marks_awarded: Mapped[float] = mapped_column(Float, default=0.0)
    answered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    attempt: Mapped["StudentAttempt"] = relationship(back_populates="question_attempts")
    question: Mapped["Question"] = relationship(back_populates="attempts")


# ─────────────────────────────────────────────
# ADAPTIVE LEARNING ENGINE
# ─────────────────────────────────────────────

class MasteryScore(Base):
    """Core of the adaptive engine — per-student, per-concept mastery."""
    __tablename__ = "mastery_scores"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("student_profiles.id"))
    concept_id: Mapped[str] = mapped_column(String(36), ForeignKey("concepts.id"))
    mastery_score: Mapped[float] = mapped_column(Float, default=0.0)  # 0-100
    confidence: Mapped[float] = mapped_column(Float, default=0.0)  # 0-1 certainty of score
    recent_accuracy: Mapped[float] = mapped_column(Float, default=0.0)
    historical_accuracy: Mapped[float] = mapped_column(Float, default=0.0)
    total_attempts: Mapped[int] = mapped_column(Integer, default=0)
    correct_attempts: Mapped[int] = mapped_column(Integer, default=0)
    avg_response_time: Mapped[Optional[float]] = mapped_column(Float)
    consistency_score: Mapped[float] = mapped_column(Float, default=0.0)
    difficulty_adjusted_score: Mapped[float] = mapped_column(Float, default=0.0)
    last_assessed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    student: Mapped["StudentProfile"] = relationship(back_populates="mastery_scores")
    concept: Mapped["Concept"] = relationship(back_populates="mastery_scores")

    __table_args__ = (
        UniqueConstraint("student_id", "concept_id"),
        Index("ix_mastery_student_score", "student_id", "mastery_score"),
    )


class LearningPath(Base):
    __tablename__ = "learning_paths"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("student_profiles.id"))
    course_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("courses.id"))
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    generation_reason: Mapped[Optional[str]] = mapped_column(Text)

    student: Mapped["StudentProfile"] = relationship(back_populates="learning_paths")
    items: Mapped[List["LearningPathItem"]] = relationship(back_populates="path", order_by="LearningPathItem.position")


class LearningPathItem(Base):
    __tablename__ = "learning_path_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    path_id: Mapped[str] = mapped_column(String(36), ForeignKey("learning_paths.id"))
    concept_id: Mapped[str] = mapped_column(String(36), ForeignKey("concepts.id"))
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    recommended_action: Mapped[str] = mapped_column(String(100))  # learn, practice, revise, skip
    reason: Mapped[Optional[str]] = mapped_column(Text)  # Human-readable explanation
    status: Mapped[PathItemStatus] = mapped_column(Enum(PathItemStatus), default=PathItemStatus.not_started)
    priority: Mapped[float] = mapped_column(Float, default=1.0)
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=20)
    mastery_at_creation: Mapped[Optional[float]] = mapped_column(Float)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    path: Mapped["LearningPath"] = relationship(back_populates="items")
    concept: Mapped["Concept"] = relationship(back_populates="path_items")


class RevisionItem(Base):
    """Spaced repetition schedule per student per concept."""
    __tablename__ = "revision_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("student_profiles.id"))
    concept_id: Mapped[str] = mapped_column(String(36), ForeignKey("concepts.id"))
    due_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    interval_days: Mapped[float] = mapped_column(Float, default=1.0)
    ease_factor: Mapped[float] = mapped_column(Float, default=2.5)  # SM-2 ease factor
    repetitions: Mapped[int] = mapped_column(Integer, default=0)
    estimated_recall: Mapped[float] = mapped_column(Float, default=1.0)  # 0-1
    last_reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    student: Mapped["StudentProfile"] = relationship(back_populates="revision_items")
    concept: Mapped["Concept"] = relationship(back_populates="revision_items")

    __table_args__ = (
        UniqueConstraint("student_id", "concept_id"),
        Index("ix_revision_due", "student_id", "due_at"),
    )


# ─────────────────────────────────────────────
# GOALS & GAMIFICATION
# ─────────────────────────────────────────────

class Goal(Base):
    __tablename__ = "goals"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("student_profiles.id"))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    target_type: Mapped[str] = mapped_column(String(50))  # mastery, exam, completion, daily
    target_value: Mapped[Optional[float]] = mapped_column(Float)
    current_value: Mapped[float] = mapped_column(Float, default=0.0)
    deadline: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    student: Mapped["StudentProfile"] = relationship(back_populates="goals")


class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    icon: Mapped[str] = mapped_column(String(100))
    xp_reward: Mapped[int] = mapped_column(Integer, default=100)
    trigger_type: Mapped[str] = mapped_column(String(50))  # streak, mastery, questions, etc.
    trigger_value: Mapped[Optional[float]] = mapped_column(Float)
    rarity: Mapped[str] = mapped_column(String(20), default="common")  # common, rare, epic, legendary
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    earned_by: Mapped[List["StudentAchievement"]] = relationship(back_populates="achievement")


class StudentAchievement(Base):
    __tablename__ = "student_achievements"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("student_profiles.id"))
    achievement_id: Mapped[str] = mapped_column(String(36), ForeignKey("achievements.id"))
    earned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    student: Mapped["StudentProfile"] = relationship(back_populates="achievements")
    achievement: Mapped["Achievement"] = relationship(back_populates="earned_by")

    __table_args__ = (UniqueConstraint("student_id", "achievement_id"),)


# ─────────────────────────────────────────────
# EVENTS, AI, NOTIFICATIONS
# ─────────────────────────────────────────────

class LearningEvent(Base):
    """Immutable event log — the source of truth for analytics."""
    __tablename__ = "learning_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"))
    event_type: Mapped[LearningEventType] = mapped_column(Enum(LearningEventType))
    resource_type: Mapped[Optional[str]] = mapped_column(String(50))
    resource_id: Mapped[Optional[str]] = mapped_column(String(36))
    event_metadata: Mapped[Optional[dict]] = mapped_column("metadata", JSON)
    session_id: Mapped[Optional[str]] = mapped_column(String(36))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user: Mapped["User"] = relationship(back_populates="learning_events")

    __table_args__ = (Index("ix_events_user_type_time", "user_id", "event_type", "created_at"),)


class AIInteraction(Base):
    """AI usage log for safety, analytics, and cost tracking."""
    __tablename__ = "ai_interactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"))
    feature: Mapped[str] = mapped_column(String(100))  # tutor, question_gen, explain, etc.
    provider: Mapped[str] = mapped_column(String(50))
    model: Mapped[Optional[str]] = mapped_column(String(100))
    prompt_tokens: Mapped[Optional[int]] = mapped_column(Integer)
    completion_tokens: Mapped[Optional[int]] = mapped_column(Integer)
    latency_ms: Mapped[Optional[int]] = mapped_column(Integer)
    is_fallback: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user: Mapped["User"] = relationship(back_populates="ai_interactions")


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[NotificationType] = mapped_column(Enum(NotificationType))
    action_url: Mapped[Optional[str]] = mapped_column(String(500))
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user: Mapped["User"] = relationship(back_populates="notifications")

    __table_args__ = (Index("ix_notifications_user_unread", "user_id", "read_at"),)


class AuditLog(Base):
    """Immutable audit trail for admin actions."""
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    actor_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"))
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    resource_type: Mapped[Optional[str]] = mapped_column(String(50))
    resource_id: Mapped[Optional[str]] = mapped_column(String(36))
    old_value: Mapped[Optional[dict]] = mapped_column(JSON)
    new_value: Mapped[Optional[dict]] = mapped_column(JSON)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))
    user_agent: Mapped[Optional[str]] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class RAGDocument(Base):
    """Educational content indexed for retrieval-augmented generation."""
    __tablename__ = "rag_documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    topic_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("topics.id"))
    concept_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("concepts.id"))
    resource_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("learning_resources.id"))
    title: Mapped[str] = mapped_column(String(500))
    chunk_text: Mapped[str] = mapped_column(Text, nullable=False)
    chunk_index: Mapped[int] = mapped_column(Integer, default=0)
    language: Mapped[str] = mapped_column(String(10), default="en")
    source_url: Mapped[Optional[str]] = mapped_column(String(1000))
    curriculum: Mapped[Optional[str]] = mapped_column(String(100))
    # embedding stored via pgvector - added via migration
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    __table_args__ = (Index("ix_rag_topic_lang", "topic_id", "language"),)
