"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, TrendingUp, AlertTriangle, BookOpen, Brain, BarChart3,
  Target, CheckCircle2, Clock, ChevronRight, Plus, Filter,
  Download, Search, Send, Loader2, Star, ArrowDown, ArrowUp,
  Activity, GraduationCap, Flame, LayoutDashboard
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

// ─── Demo Data ─────────────────────────────────────────────────────────────
const CLASS = { name: "Class 12-A", subject: "Data Structures & Algorithms", students: 38, active: 31 };

const METRICS = [
  { label: "Total Students", value: 38, icon: Users, iconClass: "metric-icon-primary", delta: "All enrolled", up: true },
  { label: "Active Today", value: 31, icon: Activity, iconClass: "metric-icon-success", delta: "82% active rate", up: true },
  { label: "Avg Mastery", value: "67%", icon: TrendingUp, iconClass: "metric-icon-accent", delta: "+4% this week", up: true },
  { label: "At Risk", value: 5, icon: AlertTriangle, iconClass: "metric-icon-danger", delta: "Needs attention", up: false },
];

const TOPICS = ["Arrays", "Sorting", "Recursion", "Trees", "Graphs", "DP"];

const STUDENTS = [
  { name: "Aarav Sharma", avatar: "AS", scores: [85, 72, 43, 28, 20, 15], risk: false, activity: "high" },
  { name: "Priya Mehta", avatar: "PM", scores: [92, 88, 71, 55, 48, 40], risk: false, activity: "high" },
  { name: "Rohit Kumar", avatar: "RK", scores: [45, 38, 22, 15, 10, 8], risk: true, activity: "low" },
  { name: "Ananya Patel", avatar: "AP", scores: [78, 65, 58, 44, 35, 28], risk: false, activity: "medium" },
  { name: "Kabir Singh", avatar: "KS", scores: [55, 48, 30, 18, 12, 5], risk: true, activity: "low" },
  { name: "Sneha Rao", avatar: "SR", scores: [88, 84, 75, 62, 55, 48], risk: false, activity: "high" },
  { name: "Dev Joshi", avatar: "DJ", scores: [40, 32, 20, 12, 8, 5], risk: true, activity: "low" },
  { name: "Nisha Agarwal", avatar: "NA", scores: [72, 68, 50, 40, 33, 25], risk: false, activity: "medium" },
];

const TREND_DATA = [
  { week: "Week 1", avg: 52 },
  { week: "Week 2", avg: 56 },
  { week: "Week 3", avg: 60 },
  { week: "Week 4", avg: 62 },
  { week: "Week 5", avg: 65 },
  { week: "Week 6", avg: 67 },
];

const TOPIC_WEAKNESS = [
  { topic: "Dynamic Programming", weakStudents: 29, avgMastery: 22 },
  { topic: "Graph Algorithms", weakStudents: 24, avgMastery: 28 },
  { topic: "Trees", weakStudents: 20, avgMastery: 34 },
  { topic: "Recursion", weakStudents: 18, avgMastery: 38 },
  { topic: "Sorting", weakStudents: 8, avgMastery: 58 },
];

const AI_MESSAGES = [
  { role: "assistant", content: "Hello, Priya! I'm your AI Teaching Copilot. I have full context on your class — 38 students, current mastery data, and recent performance trends. How can I help you today?" },
];

// ─── Heatmap ───────────────────────────────────────────────────────────────
function scoreToColor(score: number) {
  if (score >= 75) return "hsl(142,68%,45%)";
  if (score >= 55) return "hsl(38,92%,50%)";
  if (score >= 35) return "hsl(221,83%,53%)";
  return "hsl(0,84%,60%)";
}

function Heatmap() {
  const [hoveredCell, setHoveredCell] = useState<{ student: string; topic: string; score: number } | null>(null);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "separate", borderSpacing: "4px", minWidth: "500px" }}>
        <thead>
          <tr>
            <th style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textAlign: "left", fontWeight: 600, padding: "0 0.5rem 0.5rem", minWidth: "100px" }}>Student</th>
            {TOPICS.map(t => (
              <th key={t} style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textAlign: "center", fontWeight: 600, padding: "0 0.25rem 0.5rem", width: "60px" }}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STUDENTS.map(student => (
            <tr key={student.name}>
              <td style={{ padding: "2px 0.5rem 2px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  {student.risk && <AlertTriangle size={11} style={{ color: "var(--danger)", flexShrink: 0 }} />}
                  <span style={{ fontSize: "0.78rem", color: student.risk ? "var(--danger)" : "var(--text-secondary)", fontWeight: student.risk ? 600 : 400 }}>
                    {student.name.split(" ")[0]}
                  </span>
                </div>
              </td>
              {student.scores.map((score, i) => (
                <td key={i} style={{ padding: "2px" }}>
                  <div
                    className="heatmap-cell"
                    style={{ background: scoreToColor(score), opacity: 0.25 + (score / 100) * 0.75, cursor: "pointer" }}
                    onMouseEnter={() => setHoveredCell({ student: student.name, topic: TOPICS[i], score })}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={`${student.name} — ${TOPICS[i]}: ${score}%`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.875rem", fontSize: "0.7rem", color: "var(--text-tertiary)" }}>
        <span>Mastery:</span>
        {[{ label: "< 35%", color: "hsl(0,84%,60%)" }, { label: "35–55%", color: "hsl(221,83%,53%)" }, { label: "55–75%", color: "hsl(38,92%,50%)" }, { label: "> 75%", color: "hsl(142,68%,45%)" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <div style={{ width: 12, height: 12, borderRadius: "3px", background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI Copilot Chat ───────────────────────────────────────────────────────
function TeacherCopilot() {
  const [messages, setMessages] = useState(AI_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const DEMO_RESPONSES: Record<string, string> = {
    recursion: `**Students struggling with Recursion:**

Based on your class data, **18 students** (47%) have mastery < 50% on Recursion.

**Most affected:** Rohit Kumar (22%), Dev Joshi (20%), Kabir Singh (30%)

**Recommended interventions:**
1. 📌 Schedule a 30-min remedial class focusing on the call stack
2. 🎯 Assign the "Recursion Patterns" practice set (10 questions)
3. 🤖 Enable AI Tutor for these 3 students with Recursion context
4. 📊 Re-assess in 5 days

Want me to **generate the practice set** or **draft the lesson plan**?`,
    quiz: `**Generated: DBMS Normalization Quiz (20 Questions)**

✅ Question mix:
- 8 MCQ (easy/medium)
- 5 True/False
- 4 Fill in the blank
- 3 Short answer

Topics covered: 1NF, 2NF, 3NF, BCNF, functional dependencies

**Sample question:**
*"A relation is in 2NF if it is in 1NF and every non-prime attribute is _____ on the primary key."*

Answer: fully functionally dependent

⚠️ **Teacher review required** before publishing to class.

[Preview All 20 Questions] [Publish to Class]`,
    default: `I can help you with:
- **"Which students are struggling with recursion?"**
- **"Generate a 20-question DBMS quiz"**
- **"Create a lesson plan for binary trees"**
- **"Who hasn't submitted assignment 3?"**
- **"What should I teach this week?"**

What would you like to do?`,
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMsg, { role: "assistant" as const, content: "..." }]);
    setInput("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const response = input.toLowerCase().includes("recursion") ? DEMO_RESPONSES.recursion
      : input.toLowerCase().includes("quiz") || input.toLowerCase().includes("generate") ? DEMO_RESPONSES.quiz
        : DEMO_RESPONSES.default;

    setMessages(prev => [...prev.slice(0, -1), { role: "assistant" as const, content: response }]);
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "380px" }}>
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: "0.75rem", padding: "0 0 0.5rem" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: "0.625rem", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(262,80%,60%))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Brain size={13} color="white" />
              </div>
            )}
            <div style={{
              maxWidth: "85%",
              padding: "0.75rem 1rem",
              borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "4px 14px 14px 14px",
              background: m.role === "user" ? "var(--brand)" : "var(--bg-subtle)",
              color: m.role === "user" ? "white" : "var(--text-primary)",
              fontSize: "0.82rem",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}>
              {m.content === "..." ? <Loader2 size={14} className="spin" /> : m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Quick prompts */}
      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "0.625rem" }}>
        {["Who's struggling with recursion?", "Generate quiz on trees", "At-risk students this week"].map(p => (
          <button key={p} onClick={() => { setInput(p); }} style={{ fontSize: "0.72rem", padding: "0.25rem 0.625rem", borderRadius: "var(--radius-full)", border: "1px solid var(--border-default)", background: "var(--bg-card)", cursor: "pointer", color: "var(--text-secondary)", transition: "all 150ms" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.color = "var(--brand)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >{p}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input className="input" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask your AI teaching assistant..." onKeyDown={e => e.key === "Enter" && send()} style={{ fontSize: "0.82rem" }} />
        <button onClick={send} disabled={!input.trim() || loading} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
          {loading ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
        </button>
      </div>
    </div>
  );
}

// ─── Teacher Dashboard ─────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const [selectedStudent, setSelectedStudent] = useState<typeof STUDENTS[0] | null>(null);

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ width: 30, height: 30, borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(262,80%,60%))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={15} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>AdaptiveX AI</span>
          <span className="badge badge-muted">Teacher</span>
        </div>
        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>
          Welcome, Priya Sharma 👩‍🏫
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-secondary btn-sm" style={{ gap: "0.25rem" }}><Download size={13} /> Report</button>
          <button className="btn btn-primary btn-sm" style={{ gap: "0.25rem" }}><Plus size={13} /> New Assignment</button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="app-sidebar">
        {[
          { icon: LayoutDashboard, label: "Dashboard", active: true },
          { icon: Users, label: "Students" },
          { icon: BookOpen, label: "Classes" },
          { icon: Target, label: "Assessments" },
          { icon: BarChart3, label: "Analytics" },
          { icon: Brain, label: "AI Copilot" },
          { icon: GraduationCap, label: "Curriculum" },
        ].map(({ icon: Icon, label, active }) => (
          <div key={label} className={`nav-item ${active ? "active" : ""}`}>
            <Icon size={16} className="nav-icon" /> {label}
          </div>
        ))}
      </aside>

      <main className="app-main">
        {/* Class selector */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{CLASS.name}</h1>
            <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem" }}>{CLASS.subject} · {CLASS.students} students</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-secondary btn-sm"><Filter size={13} /> Filter</button>
            <button className="btn btn-secondary btn-sm"><Search size={13} /> Search</button>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {METRICS.map(({ label, value, icon: Icon, iconClass, delta, up }) => (
            <div key={label} className="metric-card">
              <div className={`metric-icon-wrap ${iconClass}`}><Icon size={18} /></div>
              <div>
                <div className="metric-label">{label}</div>
                <div className="metric-value" style={{ fontSize: "1.75rem" }}>{value}</div>
                <div className={`metric-delta ${up ? "positive" : "negative"}`}>
                  {up ? <ArrowUp size={10} style={{ display: "inline" }} /> : <ArrowDown size={10} style={{ display: "inline" }} />} {delta}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
          {/* Performance trend */}
          <div className="card">
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "1.25rem" }}>Class Mastery Trend</h3>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} />
                  <YAxis domain={[40, 80]} tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "8px", fontSize: "0.75rem" }} />
                  <Line type="monotone" dataKey="avg" stroke="hsl(221,83%,53%)" strokeWidth={2.5} dot={{ fill: "hsl(221,83%,53%)", r: 4 }} name="Avg Mastery %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Topic weakness */}
          <div className="card">
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "1.25rem" }}>Weakest Topics in Class</h3>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOPIC_WEAKNESS.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 10, left: 80, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 9, fill: "var(--text-tertiary)" }} />
                  <YAxis type="category" dataKey="topic" tick={{ fontSize: 9, fill: "var(--text-tertiary)" }} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "8px", fontSize: "0.75rem" }} />
                  <Bar dataKey="avgMastery" fill="hsl(0,84%,60%)" name="Avg Mastery %" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>Student × Topic Mastery Heatmap</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "2px" }}>Click a student to view detailed profile</p>
            </div>
            <span className="badge badge-danger">5 at risk</span>
          </div>
          <Heatmap />
        </div>

        {/* Bottom grid: At-risk students + AI Copilot */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "1.5rem" }}>
          {/* At-risk */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>⚠ Needs Attention</h3>
              <span className="badge badge-danger">5 students</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {STUDENTS.filter(s => s.risk).map(s => (
                <div key={s.name} style={{
                  display: "flex", alignItems: "center", gap: "0.875rem",
                  padding: "0.875rem", background: "var(--danger-muted)",
                  border: "1px solid hsla(0,84%,60%,0.2)", borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                }}
                  onClick={() => setSelectedStudent(s)}
                >
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, color: "white", flexShrink: 0 }}>
                    {s.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{s.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                      Avg mastery: <span style={{ color: "var(--danger)", fontWeight: 600 }}>{Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length)}%</span>
                      {" · "}Activity: <span style={{ color: "var(--danger)", fontWeight: 600 }}>Low</span>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: "var(--text-tertiary)" }} />
                </div>
              ))}
            </div>
          </div>

          {/* AI Copilot */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: "10px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(262,80%,60%))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Brain size={16} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>AI Teaching Copilot</h3>
                <div className="ai-badge">Full class context</div>
              </div>
            </div>
            <TeacherCopilot />
          </div>
        </div>
      </main>

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
