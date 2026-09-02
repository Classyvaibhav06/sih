"use client";

import Link from "next/link";
import { Brain, TrendingUp, AlertTriangle, Clock, BookOpen, Star, Calendar, BarChart3, ChevronRight, ArrowUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CHILD = {
  name: "Aarav Sharma",
  grade: "Class 12 — CBSE",
  school: "Delhi Public School",
  avatar: "AS",
  streak: 14,
};

const WEEKLY_DATA = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 60 },
  { day: "Wed", minutes: 30 },
  { day: "Thu", minutes: 75 },
  { day: "Fri", minutes: 50 },
  { day: "Sat", minutes: 90 },
  { day: "Sun", minutes: 40 },
];

const SUBJECTS = [
  { name: "Data Structures", score: 71, trend: "up", color: "hsl(221,83%,53%)" },
  { name: "DBMS", score: 82, trend: "up", color: "hsl(142,68%,45%)" },
  { name: "Operating Systems", score: 57, trend: "stable", color: "hsl(38,92%,50%)" },
];

const UPCOMING = [
  { title: "DSA Practice Test", date: "Sep 2, 2026", type: "test" },
  { title: "DBMS Assignment", date: "Sep 5, 2026", type: "assignment" },
  { title: "OS Revision Due", date: "Sep 3, 2026", type: "revision" },
];

export default function ParentDashboard() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Header */}
      <header style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", background: "var(--bg-header)", borderBottom: "1px solid var(--border-subtle)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 30, height: 30, borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(262,80%,60%))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={15} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>AdaptiveX AI</span>
          <span className="badge badge-muted">Parent View</span>
        </div>
        <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Rajesh Sharma</span>
      </header>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        {/* Child card */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", background: "linear-gradient(135deg, var(--brand-muted), var(--accent-muted))", border: "1px solid var(--brand-subtle)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(262,80%,60%))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 800, color: "white", flexShrink: 0 }}>
            {CHILD.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>{CHILD.name}</h1>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{CHILD.grade} · {CHILD.school}</div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <span className="badge badge-warning">🔥 {CHILD.streak} day streak</span>
              <span className="badge badge-success">Active learner</span>
            </div>
          </div>
          {/* AI weekly summary */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", padding: "1rem", maxWidth: "280px" }}>
            <div style={{ display: "flex", gap: "0.375rem", alignItems: "center", marginBottom: "0.5rem" }}>
              <Brain size={14} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--accent)" }}>AI Weekly Summary</span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Aarav improved in <strong>DBMS this week (+8%)</strong>. He needs more practice on Binary Trees (38%). Overall performance is <strong style={{ color: "var(--success)" }}>on track</strong>.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
          {/* Weekly activity */}
          <div className="card">
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "1rem" }}>Weekly Learning Time</h3>
            <div style={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WEEKLY_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "8px", fontSize: "0.75rem" }} formatter={(v: any) => [`${v} min`, "Study time"]} />
                  <Line type="monotone" dataKey="minutes" stroke="hsl(221,83%,53%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(221,83%,53%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-tertiary)", marginTop: "0.5rem" }}>
              Total this week: <strong style={{ color: "var(--text-primary)" }}>390 min (6.5 hours)</strong>
            </div>
          </div>

          {/* Subject mastery */}
          <div className="card">
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "1rem" }}>Subject Progress</h3>
            {SUBJECTS.map(s => (
              <div key={s.name} style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 500 }}>{s.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    {s.trend === "up" && <ArrowUp size={11} style={{ color: "var(--success)" }} />}
                    <span style={{ fontWeight: 700, color: s.color }}>{s.score}%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${s.score}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Weak areas */}
          <div className="card">
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.875rem" }}>Areas Needing Attention</h3>
            {[
              { name: "Binary Trees", score: 38, note: "3 failed quiz attempts" },
              { name: "OS Scheduling", score: 49, note: "Needs revision before exam" },
            ].map(a => (
              <div key={a.name} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.75rem", background: "var(--danger-muted)", borderRadius: "var(--radius-lg)", marginBottom: "0.5rem" }}>
                <AlertTriangle size={16} style={{ color: "var(--danger)", flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{a.name} — <span style={{ color: "var(--danger)" }}>{a.score}%</span></div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>{a.note}</div>
                </div>
              </div>
            ))}
            <p style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: "0.75rem" }}>
              Recommendation: Encourage 20 minutes of practice on these topics daily.
            </p>
          </div>

          {/* Upcoming */}
          <div className="card">
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.875rem" }}>Upcoming</h3>
            {UPCOMING.map(u => (
              <div key={u.title} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ width: 28, height: 28, borderRadius: "8px", background: u.type === "test" ? "var(--danger-muted)" : u.type === "assignment" ? "var(--warning-muted)" : "var(--brand-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calendar size={13} style={{ color: u.type === "test" ? "var(--danger)" : u.type === "assignment" ? "var(--warning)" : "var(--brand)" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>{u.title}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{u.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
