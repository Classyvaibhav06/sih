# AdaptiveX AI — Smart Education Adaptive Platform

> **Built for Smart India Hackathon 2024 — Problem Statement: Smart Education**

An AI-powered adaptive learning platform that understands what each learner knows, what they struggle with, and what they should learn next — and acts on it continuously.

---

## 🚀 Quick Start (Demo Mode)

All features run **fully offline** in demo mode — no AI API key needed.

### Frontend (Next.js)
```bash
cd apps/web
npm run dev
# Open http://localhost:3000
```

### Backend (FastAPI)
```bash
cd apps/api
pip install -r requirements.txt
# Create .env from .env.example
cp .env.example .env
uvicorn main:app --reload --port 8000
# Docs at http://localhost:8000/api/docs
```

---

## 🎯 Demo Accounts

Click the demo quick-fill on the login page or use directly:

| Role | Email | Password |
|------|-------|----------|
| 🎓 Student | `aarav@demo.adaptivex.ai` | `Demo@1234` |
| 📚 Teacher | `priya.teacher@demo.adaptivex.ai` | `Demo@1234` |
| 👨‍👩‍👦 Parent | `parent@demo.adaptivex.ai` | `Demo@1234` |
| 👑 Admin | `admin@demo.adaptivex.ai` | `Demo@1234` |

---

## 📦 Architecture

```
SIH/
├── apps/
│   ├── web/          # Next.js 16 frontend
│   │   ├── src/app/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── auth/login/           # Login page
│   │   │   ├── auth/register/        # 6-step onboarding
│   │   │   ├── dashboard/            # Student dashboard
│   │   │   ├── dashboard/tutor/      # AI Tutor
│   │   │   ├── teacher/              # Teacher analytics
│   │   │   └── parent/               # Parent monitoring
│   │   └── src/components/
│   │       └── providers.tsx         # Query + Theme providers
│   └── api/          # FastAPI backend
│       ├── main.py
│       └── app/
│           ├── core/
│           │   ├── config.py         # Settings
│           │   ├── database.py       # Async SQLAlchemy
│           │   └── security.py       # JWT auth
│           ├── models/models.py      # 35+ ORM models
│           ├── api/v1/endpoints/
│           │   ├── auth.py           # Register, login, refresh
│           │   ├── ai.py             # Tutor, Q-gen, explain
│           │   ├── students.py
│           │   ├── teachers.py
│           │   └── ...
│           └── services/
│               ├── ai_provider.py    # Gemini/OpenAI/Fallback
│               ├── mastery_service.py # Mastery scoring engine
│               └── spaced_repetition.py # SM-2 algorithm
└── package.json      # Root monorepo
```

---

## 🧠 Core Algorithms

### Mastery Scoring Engine
Calculates student mastery per concept using a weighted formula:
```python
mastery = recency_score × 0.35 + accuracy_score × 0.30 + 
          consistency_score × 0.20 + difficulty_score × 0.15
```
Factors: recent performance, attempt accuracy, consistency, answer difficulty

### SM-2 Spaced Repetition
Schedules revision at optimal forgetting-curve intervals:
```python
interval = max(1, previous_interval × easiness_factor)
easiness_factor += 0.1 - (5 - quality) × (0.08 + (5 - quality) × 0.02)
```

### AI Provider Abstraction
```
AI_PROVIDER=gemini   → Google Gemini (production)
AI_PROVIDER=openai   → OpenAI GPT-4
AI_PROVIDER=fallback → Deterministic demo mode (no API key needed)
```

---

## 🔑 Key Features

### Student
- **Adaptive Learning Path** — dynamically built based on mastery
- **AI Tutor** — streaming, context-aware, Socratic method
- **Knowledge Gap Detection** — identifies weak concepts with evidence
- **Spaced Repetition** — SM-2 revision scheduler
- **Real-time Mastery Tracking** — per-concept, per-subject
- **Gamification** — XP, levels, streaks, achievements
- **Multilingual** — Hindi, English, Bilingual support
- **Voice AI** — push-to-talk interface

### Teacher
- **Class Heatmaps** — student × topic mastery matrix
- **At-Risk Detection** — AI identifies struggling students early
- **AI Teaching Copilot** — natural language queries about class data
- **Question Generator** — AI-creates assessments with teacher review
- **Intervention Recommendations** — with evidence and suggested actions

### Parent
- **Progress Monitoring** — real-time visibility into child's learning
- **AI Weekly Summary** — automated plain-language report
- **Weak Area Alerts** — notified before issues compound

---

## 🛠 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Vanilla CSS with design tokens (dark/light mode) |
| Charts | Recharts |
| Animations | Framer Motion |
| State | TanStack Query v5 + Zustand |
| Backend | FastAPI, Python 3.11 |
| Database | PostgreSQL with async SQLAlchemy |
| ORM | SQLAlchemy 2.0 (async) |
| AI | Google Gemini / OpenAI / Fallback |
| Auth | JWT (access + refresh tokens) |
| PWA | Offline-capable with service worker |

---

## 🔌 Real AI Setup (Optional)

Set in `apps/api/.env`:
```bash
AI_PROVIDER=gemini
GOOGLE_AI_API_KEY=your-api-key-here
```

Or for OpenAI:
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your-api-key-here
```

---

## 📊 Database Schema

35+ normalized tables including:
- `users`, `student_profiles`, `teacher_profiles`, `parent_profiles`
- `subjects`, `topics`, `content_items`
- `learning_paths`, `path_nodes`
- `assessments`, `questions`, `question_attempts`
- `mastery_scores`, `spaced_repetition_cards`
- `ai_interactions`, `knowledge_graph_nodes`

---

## 🏗 What's Production-Ready

- ✅ Real mastery scoring algorithm
- ✅ SM-2 spaced repetition engine
- ✅ JWT auth with refresh tokens
- ✅ AI provider abstraction (3 providers)
- ✅ Streaming AI responses (SSE)
- ✅ Dark/light mode with system preference
- ✅ Responsive design (mobile-first)
- ✅ Offline demo mode for judges
- ✅ Semantic HTML + accessibility
- ✅ Full SEO metadata

---

## 🎬 Demo Flow for Judges

1. **Open** `http://localhost:3000` — premium landing page
2. **Login** with 🎓 Student demo account
3. **View** the dashboard — metrics, weak areas, AI recommendation
4. **Click** "AI Tutor" — type "explain recursion" or use quick actions
5. **Login** with 📚 Teacher account
6. **View** class heatmap, at-risk students, AI Copilot
7. Ask copilot: "Which students are struggling with recursion?"

---

Built with ❤️ for Smart India Hackathon 2024
