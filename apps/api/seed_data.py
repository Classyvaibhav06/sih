"""
AdaptiveX AI — Database Seeding Script
Populates demo curriculum (DSA, DBMS, OS, Computer Networks)
and standard demo user profiles for Students, Teachers, Parents, and Admins.
"""
import asyncio
import uuid
from app.core.database import AsyncSessionLocal, engine, Base
from app.models.models import (
    User, UserRole, StudentProfile, TeacherProfile, ParentProfile,
    Subject, Chapter, Concept, DifficultyLevel, LearningMode
)
from app.core.security import get_password_hash


async def seed_database():
    print("🌱 Starting AdaptiveX AI Database Seeding...")

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 1. Create Core Demo Users
        users_data = [
            {
                "email": "aarav@demo.adaptivex.ai",
                "name": "Aarav Sharma",
                "role": UserRole.student,
                "password": "Demo@1234",
            },
            {
                "email": "priya.teacher@demo.adaptivex.ai",
                "name": "Priya Sharma (Faculty)",
                "role": UserRole.teacher,
                "password": "Demo@1234",
            },
            {
                "email": "parent@demo.adaptivex.ai",
                "name": "Rajesh Sharma (Parent)",
                "role": UserRole.parent,
                "password": "Demo@1234",
            },
            {
                "email": "admin@demo.adaptivex.ai",
                "name": "Platform Administrator",
                "role": UserRole.platform_admin,
                "password": "Demo@1234",
            },
        ]

        for u in users_data:
            user = User(
                id=str(uuid.uuid4()),
                email=u["email"],
                name=u["name"],
                role=u["role"],
                password_hash=get_password_hash(u["password"]),
                is_active=True,
                is_verified=True,
                onboarding_completed=True,
            )
            session.add(user)
            await session.flush()

            if u["role"] == UserRole.student:
                student = StudentProfile(
                    user_id=user.id,
                    grade="Class 11",
                    board="CBSE",
                    streak_count=14,
                    total_xp=3240,
                    level=12,
                    daily_study_minutes=60,
                    preferred_learning_mode=LearningMode.mixed,
                )
                session.add(student)

            elif u["role"] == UserRole.teacher:
                teacher = TeacherProfile(
                    user_id=user.id,
                    specialization="Computer Science & Data Structures",
                    experience_years=8,
                )
                session.add(teacher)

            elif u["role"] == UserRole.parent:
                parent = ParentProfile(
                    user_id=user.id,
                    phone="+91-9876543210",
                )
                session.add(parent)

        # 2. Create Subjects
        dsa_subject = Subject(
            name="Data Structures & Algorithms",
            code="CS-201",
            icon_name="Code",
            color_code="#3B82F6",
            order_index=1,
            is_active=True,
        )
        dbms_subject = Subject(
            name="Database Management Systems",
            code="CS-202",
            icon_name="Database",
            color_code="#8B5CF6",
            order_index=2,
            is_active=True,
        )
        session.add_all([dsa_subject, dbms_subject])
        await session.flush()

        # 3. Create Chapters & Concepts
        ch1 = Chapter(
            subject_id=dsa_subject.id,
            name="Foundations & Linear Structures",
            order_index=1,
        )
        ch2 = Chapter(
            subject_id=dsa_subject.id,
            name="Algorithms & Recursion",
            order_index=2,
        )
        session.add_all([ch1, ch2])
        await session.flush()

        concepts = [
            Concept(
                chapter_id=ch1.id,
                name="Arrays & Dynamic Sizing",
                slug="arrays-dynamic",
                difficulty=DifficultyLevel.easy,
                order_index=1,
            ),
            Concept(
                chapter_id=ch1.id,
                name="Linked Lists & Nodes",
                slug="linked-lists",
                difficulty=DifficultyLevel.medium,
                order_index=2,
            ),
            Concept(
                chapter_id=ch2.id,
                name="Recursion & Call Stack",
                slug="recursion-call-stack",
                difficulty=DifficultyLevel.medium,
                order_index=1,
            ),
            Concept(
                chapter_id=ch2.id,
                name="Binary Search Trees",
                slug="binary-search-trees",
                difficulty=DifficultyLevel.hard,
                order_index=2,
            ),
        ]
        session.add_all(concepts)

        await session.commit()
        print("✅ Seeding completed successfully! Demo accounts and curriculum ready.")


if __name__ == "__main__":
    asyncio.run(seed_database())
