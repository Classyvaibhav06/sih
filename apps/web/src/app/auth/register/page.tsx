"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";

const GRADES = ["Class 9", "Class 10", "Class 11", "Class 12", "B.Tech 1st Year", "B.Tech 2nd Year", "B.Tech 3rd Year", "B.Tech 4th Year", "MCA", "Other"];
const BOARDS = ["CBSE", "ICSE", "State Board", "IB", "University", "Other"];
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Data Structures & Algorithms", "DBMS", "Operating Systems", "Computer Networks", "English", "Economics"];
const GOALS = [
  { value: "jee", label: "JEE Preparation", icon: "🎯" },
  { value: "gate", label: "GATE Preparation", icon: "🔬" },
  { value: "board", label: "Board Exams", icon: "📋" },
  { value: "placement", label: "Campus Placement", icon: "💼" },
  { value: "semester", label: "Semester Exams", icon: "📚" },
  { value: "learning", label: "Self Learning", icon: "🌱" },
];
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "bilingual", label: "Bilingual (EN + HI)" },
];
const MODES = [
  { value: "visual", label: "Visual Learner", desc: "Diagrams, flowcharts, videos", icon: "🎨" },
  { value: "reading", label: "Reading", desc: "Articles, notes, summaries", icon: "📖" },
  { value: "practice", label: "Practice-first", desc: "Jump into problems", icon: "⚡" },
  { value: "mixed", label: "Mixed", desc: "Balance of everything", icon: "🎯" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    grade: "",
    board: "CBSE",
    subjects: [] as string[],
    goal: "",
    language: "en",
    learningMode: "mixed",
    dailyMinutes: 60,
  });

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const toggleSubject = (s: string) => {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(s) ? f.subjects.filter(x => x !== s) : [...f.subjects, s],
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(s => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push("/onboarding/diagnostic");
  };

  const canContinue = () => {
    if (step === 1) return form.name.trim() && form.email.trim() && form.password.length >= 8;
    if (step === 2) return form.grade && form.board;
    if (step === 3) return form.subjects.length > 0;
    if (step === 4) return form.goal;
    return true;
  };

  const progressPct = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg-base)", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(262,80%,60%))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={18} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1rem" }}>AdaptiveX AI</span>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.5rem" }}>
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progressPct)}% complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="card animate-scale-in" key={step}>
          {step === 1 && (
            <StepAccount form={form} update={update} />
          )}
          {step === 2 && (
            <StepGrade form={form} update={update} />
          )}
          {step === 3 && (
            <StepSubjects form={form} toggle={toggleSubject} />
          )}
          {step === 4 && (
            <StepGoal form={form} update={update} />
          )}
          {step === 5 && (
            <StepPreferences form={form} update={update} />
          )}
          {step === 6 && (
            <StepStudyTime form={form} update={update} />
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
          {step > 1 ? (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
              <ChevronLeft size={16} /> Back
            </button>
          ) : (
            <Link href="/auth/login" className="btn btn-ghost" style={{ fontSize: "0.85rem" }}>
              Already have an account?
            </Link>
          )}

          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!canContinue() || loading}
          >
            {loading ? (
              <><Loader2 size={16} className="spin" /> Setting up...</>
            ) : step === totalSteps ? (
              <>Start Diagnostic Test <ChevronRight size={16} /></>
            ) : (
              <>Continue <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </div>
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function StepAccount({ form, update }: any) {
  return (
    <>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.375rem" }}>Create your account</h2>
      <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem", marginBottom: "1.75rem" }}>Start your personalized learning journey</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem" }}>Full Name</label>
          <input className="input" placeholder="Aarav Sharma" value={form.name} onChange={e => update("name", e.target.value)} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem" }}>Email</label>
          <input className="input" type="email" placeholder="aarav@example.com" value={form.email} onChange={e => update("email", e.target.value)} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem" }}>
            Password <span style={{ fontWeight: 400, color: "var(--text-disabled)" }}>(min 8 characters)</span>
          </label>
          <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => update("password", e.target.value)} />
        </div>
      </div>
    </>
  );
}

function StepGrade({ form, update }: any) {
  return (
    <>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.375rem" }}>Your academic level</h2>
      <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem", marginBottom: "1.75rem" }}>This helps us calibrate the right content difficulty</p>
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.625rem" }}>Grade / Year</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {GRADES.map(g => (
            <button key={g} onClick={() => update("grade", g)}
              style={{
                padding: "0.625rem 0.75rem", borderRadius: "8px", fontSize: "0.825rem", fontWeight: 500,
                border: `1px solid ${form.grade === g ? "var(--brand)" : "var(--border-default)"}`,
                background: form.grade === g ? "var(--brand-muted)" : "var(--bg-card)",
                color: form.grade === g ? "var(--brand)" : "var(--text-secondary)",
                cursor: "pointer", transition: "all 150ms", textAlign: "left",
              }}
            >
              {form.grade === g && <Check size={12} style={{ display: "inline", marginRight: "6px" }} />}
              {g}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Board / Curriculum</label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {BOARDS.map(b => (
            <button key={b} onClick={() => update("board", b)}
              style={{
                padding: "0.375rem 0.75rem", borderRadius: "var(--radius-full)", fontSize: "0.8rem", fontWeight: 500,
                border: `1px solid ${form.board === b ? "var(--brand)" : "var(--border-default)"}`,
                background: form.board === b ? "var(--brand-muted)" : "transparent",
                color: form.board === b ? "var(--brand)" : "var(--text-tertiary)",
                cursor: "pointer", transition: "all 150ms",
              }}
            >{b}</button>
          ))}
        </div>
      </div>
    </>
  );
}

function StepSubjects({ form, toggle }: any) {
  return (
    <>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.375rem" }}>Your subjects</h2>
      <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem", marginBottom: "1.75rem" }}>Select all subjects you want to learn or improve</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        {SUBJECTS.map(s => {
          const selected = form.subjects.includes(s);
          return (
            <button key={s} onClick={() => toggle(s)}
              style={{
                padding: "0.75rem", borderRadius: "10px", fontSize: "0.825rem", fontWeight: 500,
                border: `1px solid ${selected ? "var(--brand)" : "var(--border-default)"}`,
                background: selected ? "var(--brand-muted)" : "var(--bg-card)",
                color: selected ? "var(--brand)" : "var(--text-secondary)",
                cursor: "pointer", transition: "all 150ms", textAlign: "left",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}
            >
              {selected ? <Check size={14} style={{ flexShrink: 0 }} /> : <div style={{ width: 14, height: 14, borderRadius: "4px", border: "1px solid var(--border-default)", flexShrink: 0 }} />}
              {s}
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepGoal({ form, update }: any) {
  return (
    <>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.375rem" }}>What&apos;s your main goal?</h2>
      <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem", marginBottom: "1.75rem" }}>We&apos;ll optimize your learning path around this</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {GOALS.map(g => {
          const selected = form.goal === g.value;
          return (
            <button key={g.value} onClick={() => update("goal", g.value)}
              style={{
                padding: "0.875rem 1rem", borderRadius: "12px", fontSize: "0.9rem", fontWeight: 500,
                border: `1px solid ${selected ? "var(--brand)" : "var(--border-default)"}`,
                background: selected ? "var(--brand-muted)" : "var(--bg-card)",
                color: selected ? "var(--brand)" : "var(--text-secondary)",
                cursor: "pointer", transition: "all 150ms", textAlign: "left",
                display: "flex", alignItems: "center", gap: "0.75rem",
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>{g.icon}</span>
              <span style={{ fontWeight: 600 }}>{g.label}</span>
              {selected && <Check size={16} style={{ marginLeft: "auto" }} />}
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepPreferences({ form, update }: any) {
  return (
    <>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.375rem" }}>Learning preferences</h2>
      <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem", marginBottom: "1.75rem" }}>Customize how the AI presents content to you</p>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.625rem" }}>Preferred Language</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {LANGUAGES.map(lang => (
            <button key={lang.value} onClick={() => update("language", lang.value)}
              style={{
                padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.875rem",
                border: `1px solid ${form.language === lang.value ? "var(--brand)" : "var(--border-default)"}`,
                background: form.language === lang.value ? "var(--brand-muted)" : "var(--bg-card)",
                color: form.language === lang.value ? "var(--brand)" : "var(--text-secondary)",
                cursor: "pointer", transition: "all 150ms", textAlign: "left",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}
            >
              {form.language === lang.value && <Check size={14} />}
              {lang.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.625rem" }}>Learning Style</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {MODES.map(mode => (
            <button key={mode.value} onClick={() => update("learningMode", mode.value)}
              style={{
                padding: "0.875rem", borderRadius: "10px",
                border: `1px solid ${form.learningMode === mode.value ? "var(--brand)" : "var(--border-default)"}`,
                background: form.learningMode === mode.value ? "var(--brand-muted)" : "var(--bg-card)",
                color: form.learningMode === mode.value ? "var(--brand)" : "var(--text-secondary)",
                cursor: "pointer", transition: "all 150ms", textAlign: "left",
              }}
            >
              <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{mode.icon}</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{mode.label}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: "2px" }}>{mode.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function StepStudyTime({ form, update }: any) {
  const options = [30, 45, 60, 90, 120];
  return (
    <>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.375rem" }}>Daily study time</h2>
      <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem", marginBottom: "1.75rem" }}>We&apos;ll fit your learning plan into this daily window</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
        {options.map(m => (
          <button key={m} onClick={() => update("dailyMinutes", m)}
            style={{
              padding: "1rem 1.25rem", borderRadius: "12px", fontSize: "1rem",
              border: `1px solid ${form.dailyMinutes === m ? "var(--brand)" : "var(--border-default)"}`,
              background: form.dailyMinutes === m ? "var(--brand-muted)" : "var(--bg-card)",
              color: form.dailyMinutes === m ? "var(--brand)" : "var(--text-secondary)",
              cursor: "pointer", transition: "all 150ms", textAlign: "left",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              fontWeight: 600,
            }}
          >
            <span>{m >= 60 ? `${m / 60}h` : `${m}min`} per day</span>
            {form.dailyMinutes === m && <Check size={18} />}
          </button>
        ))}
      </div>
      <div style={{ padding: "1rem", background: "var(--success-muted)", borderRadius: "12px", fontSize: "0.85rem", color: "var(--success-foreground)" }}>
        🎉 All set! Next we&apos;ll run a quick diagnostic test to understand your current knowledge level and build your personalized learning path.
      </div>
    </>
  );
}
