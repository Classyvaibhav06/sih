"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain, Flame, Bell, Sun, Moon, Monitor, BookOpen, Target,
  BarChart3, Activity, RefreshCw, Award, Settings, LogOut,
  ChevronRight, Zap, Clock, TrendingUp, AlertCircle, CheckCircle2,
  PlayCircle, RotateCcw, Star, ArrowUp, Calendar, Menu, X,
  GraduationCap, MessageSquare, Users, LayoutDashboard
} from "lucide-react";
import { useTheme } from "next-themes";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

// ─── Demo Data ─────────────────────────────────────────────────────────────
const STUDENT = {
  name: "Aarav Sharma",
  grade: "B.Tech 2nd Year",
  institution: "IIT Demo College",
  streak: 14,
  xp: 3240,
  level: 12,
  weeklyGoalPct: 68,
  weeklyStudied: 3.4,
  weeklyGoal: 5,
  avatarInitials: "AS",
};

const MASTERY = [
  { subject: "Data Structures", score: 71, color: "hsl(221,83%,53%)", topics: 24, mastered: 17 },
  { subject: "DBMS", score: 82, color: "hsl(142,68%,45%)", topics: 18, mastered: 15 },
  { subject: "Operating Systems", score: 57, color: "hsl(38,92%,50%)", topics: 20, mastered: 11 },
  { subject: "Computer Networks", score: 64, color: "hsl(199,89%,48%)", topics: 16, mastered: 10 },
];

const WEAK_CONCEPTS = [
  { name: "Binary Trees", subject: "DSA", score: 38, reason: "3 failed attempts, avg 28% accuracy in last session", trend: "down" },
  { name: "Recursion", subject: "DSA", score: 43, reason: "High response times, frequent hints used", trend: "up" },
  { name: "OS Scheduling", subject: "OS", score: 49, reason: "Repeated missed in 2 consecutive tests", trend: "stable" },
];

const REVISION_DUE = [
  { name: "Binary Search", recall: 63, dueIn: "Today", urgent: true },
  { name: "Normalization (DBMS)", recall: 71, dueIn: "Today", urgent: true },
  { name: "Process Scheduling", recall: 78, dueIn: "Tomorrow", urgent: false },
  { name: "Tree Traversal", recall: 55, dueIn: "Today", urgent: true },
];

const TODAY_PLAN = [
  { time: "20 min", title: "Recursion Practice", type: "practice", mastery: 43, reason: "Weak area — needs attention" },
  { time: "15 min", title: "DBMS Revision", type: "revision", mastery: 82, reason: "Due for spaced repetition" },
  { time: "10 min", title: "10 Practice Questions", type: "quiz", mastery: null, reason: "Daily practice target" },
];

const PROGRESS_DATA = [
  { date: "Aug 24", dsa: 64, dbms: 75, os: 50, cn: 59 },
  { date: "Aug 25", dsa: 67, dbms: 76, os: 52, cn: 60 },
  { date: "Aug 26", dsa: 68, dbms: 79, os: 53, cn: 61 },
  { date: "Aug 27", dsa: 69, dbms: 80, os: 54, cn: 63 },
  { date: "Aug 28", dsa: 70, dbms: 81, os: 55, cn: 63 },
  { date: "Aug 29", dsa: 71, dbms: 82, os: 57, cn: 64 },
];

const AI_RECOMMENDATIONS = [
  { title: "Practice Binary Trees", reason: "Mastery 38% — your weakest topic in DSA", action: "Start 15-min session", urgent: true, type: "practice" },
  { title: "Review Recursion patterns", reason: "Upcoming assessment in 8 days", action: "View lesson", urgent: false, type: "lesson" },
  { title: "Take DBMS mock test", reason: "Mastery 82% — ready for challenge", action: "Start test", urgent: false, type: "test" },
];

// ─── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar({ active }: { active: string }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "path", label: "Learning Path", icon: Target, href: "/dashboard/path" },
    { id: "tutor", label: "AI Tutor", icon: Brain, href: "/dashboard/tutor" },
    { id: "practice", label: "Practice", icon: Zap, href: "/dashboard/practice" },
    { id: "revision", label: "Revision", icon: RefreshCw, href: "/dashboard/revision" },
    { id: "courses", label: "Courses", icon: BookOpen, href: "/dashboard/courses" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { id: "achievements", label: "Achievements", icon: Award, href: "/dashboard/achievements" },
  ];

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", marginBottom: "1.5rem" }}>
        <div style={{ width: 30, height: 30, borderRadius: "8px", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(262,80%,60%))", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Brain size={15} color="white" />
        </div>
        <span style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.02em" }}>AdaptiveX AI</span>
      </div>

      <div className="nav-section-label">Learning</div>
      {navItems.slice(0, 6).map(item => (
        <Link key={item.id} href={item.href} className={`nav-item ${active === item.id ? "active" : ""}`}>
          <item.icon size={16} className="nav-icon" /> {item.label}
        </Link>
      ))}

      <div className="nav-section-label" style={{ marginTop: "0.5rem" }}>Account</div>
      {navItems.slice(6).map(item => (
        <Link key={item.id} href={item.href} className={`nav-item ${active === item.id ? "active" : ""}`}>
          <item.icon size={16} className="nav-icon" /> {item.label}
        </Link>
      ))}

      {/* User profile at bottom */}
      <div style={{ marginTop: "auto", padding: "1rem 0 0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "background 150ms" }}
          onMouseOver={e => (e.currentTarget.style.background = "var(--bg-subtle)")}
          onMouseOut={e => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(262,80%,60%))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "white", flexShrink: 0 }}>
            {STUDENT.avatarInitials}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{STUDENT.name}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Level {STUDENT.level} · {STUDENT.xp.toLocaleString()} XP</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────
function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const themeIcon = !mounted ? null : theme === "dark" ? <Sun size={16} /> : theme === "light" ? <Moon size={16} /> : <Monitor size={16} />;
  const nextTheme = !mounted ? "light" : theme === "dark" ? "light" : theme === "light" ? "system" : "dark";

  return (
    <header className="app-header" style={{ justifyContent: "space-between" }}>
      {/* Left — mobile menu */}
      <button
        className="hide-desktop"
        onClick={() => setMobileMenuOpen(v => !v)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "0.5rem" }}
      >
        <Menu size={20} />
      </button>

      {/* Streak indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "hsl(38,92%,50%,0.1)", border: "1px solid hsl(38,92%,50%,0.2)", borderRadius: "var(--radius-full)", padding: "0.3rem 0.75rem", fontSize: "0.8rem", fontWeight: 700, color: "hsl(38,92%,40%)" }}>
        <Flame size={14} /> {STUDENT.streak} day streak
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(nextTheme)}
          style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "none", border: "1px solid var(--border-default)", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 150ms" }}
          title={`Switch to ${nextTheme} mode`}
          aria-label="Toggle theme"
        >
          {themeIcon}
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen(v => !v)}
            style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "none", border: "1px solid var(--border-default)", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span style={{ position: "absolute", top: 6, right: 7, width: 7, height: 7, borderRadius: "50%", background: "var(--danger)", border: "1.5px solid var(--bg-header)" }} />
          </button>

          {notifOpen && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)", width: "320px",
              background: "var(--bg-card)", border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)", zIndex: 200,
              overflow: "hidden",
            }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Notifications</span>
                <span className="badge badge-danger">3 new</span>
              </div>
              {[
                { icon: "⏰", title: "Revision due today", msg: "Binary Search needs review — estimated recall 63%", time: "Now" },
                { icon: "📋", title: "New assignment", msg: "Teacher Priya posted: DSA Practice Set 4", time: "2h ago" },
                { icon: "🎉", title: "Mastery improved!", msg: "DBMS went from 74% to 82% this week", time: "Yesterday" },
              ].map((n, i) => (
                <div key={i} style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", transition: "background 150ms" }}
                  onMouseOver={e => (e.currentTarget.style.background = "var(--bg-subtle)")}
                  onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{n.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.8rem" }}>{n.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "2px", lineHeight: 1.4 }}>{n.msg}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-disabled)", marginTop: "4px" }}>{n.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(262,80%,60%))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, color: "white", cursor: "pointer", flexShrink: 0 }}>
          {STUDENT.avatarInitials}
        </div>
      </div>
    </header>
  );
}

// ─── Progress Ring SVG ─────────────────────────────────────────────────────
function ProgressRing({ value, size = 80, stroke = 7, color = "var(--brand)" }: { value: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="mastery-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-muted)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div className="mastery-ring-text">
        <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{value}%</div>
      </div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="app-shell">
      <Header />
      <Sidebar active="dashboard" />
      <main className="app-main" role="main">
        {/* Greeting */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{greeting} 👋</p>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>{STUDENT.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              You&apos;re <strong style={{ color: "var(--brand)" }}>{STUDENT.weeklyGoalPct}%</strong> toward your weekly goal
            </div>
            <div className="progress-bar" style={{ width: "160px", height: "6px" }}>
              <div className="progress-fill" style={{ width: `${STUDENT.weeklyGoalPct}%` }} />
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{STUDENT.weeklyStudied}h / {STUDENT.weeklyGoal}h</span>
          </div>
        </div>

        {/* Top metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Streak", value: `${STUDENT.streak} days`, icon: Flame, iconClass: "metric-icon-warning", delta: "+2 this week", up: true },
            { label: "XP Earned", value: STUDENT.xp.toLocaleString(), icon: Star, iconClass: "metric-icon-accent", delta: "+320 today", up: true },
            { label: "Avg Mastery", value: "69%", icon: TrendingUp, iconClass: "metric-icon-primary", delta: "+5% this week", up: true },
            { label: "Due Revisions", value: "4", icon: Clock, iconClass: "metric-icon-danger", delta: "2 overdue", up: false },
          ].map(({ label, value, icon: Icon, iconClass, delta, up }) => (
            <div key={label} className="metric-card">
              <div className={`metric-icon-wrap ${iconClass}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="metric-label">{label}</div>
                <div className="metric-value">{value}</div>
                <div className={`metric-delta ${up ? "positive" : "negative"}`}>
                  {up ? <ArrowUp size={10} style={{ display: "inline" }} /> : "⚠ "}{delta}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Today's plan */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Today&apos;s Plan</h2>
                <span className="badge badge-primary">3 items</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {TODAY_PLAN.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem", background: "var(--bg-subtle)", borderRadius: "var(--radius-lg)", cursor: "pointer", transition: "all 150ms" }}
                    onMouseOver={e => { e.currentTarget.style.background = "var(--brand-muted)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "var(--bg-subtle)"; e.currentTarget.style.transform = "translateX(0)"; }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: "10px", background: item.type === "practice" ? "var(--accent-muted)" : item.type === "revision" ? "var(--warning-muted)" : "var(--success-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {item.type === "practice" ? <Target size={16} style={{ color: "var(--accent)" }} /> : item.type === "revision" ? <RefreshCw size={16} style={{ color: "var(--warning)" }} /> : <Zap size={16} style={{ color: "var(--success)" }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{item.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "2px" }}>{item.reason}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--brand)" }}>{item.time}</div>
                      {item.mastery && <div style={{ fontSize: "0.65rem", color: "var(--text-tertiary)" }}>{item.mastery}% mastery</div>}
                    </div>
                    <ChevronRight size={16} style={{ color: "var(--text-tertiary)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mastery overview chart */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Mastery Progress</h2>
                <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Last 6 days</span>
              </div>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PROGRESS_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} />
                    <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} />
                    <Tooltip
                      contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "8px", fontSize: "0.75rem" }}
                      labelStyle={{ fontWeight: 600 }}
                    />
                    <Line type="monotone" dataKey="dsa" stroke="hsl(221,83%,53%)" strokeWidth={2} dot={false} name="DSA" />
                    <Line type="monotone" dataKey="dbms" stroke="hsl(142,68%,45%)" strokeWidth={2} dot={false} name="DBMS" />
                    <Line type="monotone" dataKey="os" stroke="hsl(38,92%,50%)" strokeWidth={2} dot={false} name="OS" />
                    <Line type="monotone" dataKey="cn" stroke="hsl(199,89%,48%)" strokeWidth={2} dot={false} name="CN" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                {MASTERY.map(s => (
                  <div key={s.subject} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.72rem" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                    <span style={{ color: "var(--text-tertiary)" }}>{s.subject.split(" ")[0]}</span>
                    <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{s.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak concepts */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>⚠ Weak Areas — Needs Attention</h2>
                <Link href="/dashboard/path" style={{ fontSize: "0.75rem", color: "var(--brand)", textDecoration: "none" }}>View all</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {WEAK_CONCEPTS.map((c, i) => (
                  <div key={i} style={{ padding: "1rem", background: "var(--danger-muted)", border: "1px solid hsla(0,84%,60%,0.15)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <ProgressRing value={c.score} size={56} stroke={5} color="var(--danger)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{c.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>{c.subject}</div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.25rem", marginTop: "0.4rem" }}>
                        <AlertCircle size={11} style={{ color: "var(--danger)", flexShrink: 0, marginTop: "1px" }} />
                        <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", lineHeight: 1.4 }}>{c.reason}</span>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>Practice</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* AI Recommendation */}
            <div className="card" style={{ background: "linear-gradient(160deg, var(--brand-muted), var(--accent-muted))", border: "1px solid var(--brand-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <div style={{ width: 28, height: 28, borderRadius: "8px", background: "linear-gradient(135deg, var(--brand), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Brain size={14} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--brand)" }}>AI Recommendation</div>
                  <div className="ai-badge">Personalized</div>
                </div>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.6, marginBottom: "1rem" }}>
                Practice <strong>Binary Trees</strong> for 20 minutes before starting new topics. Your recursive foundations need strengthening first.
              </p>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginBottom: "0.875rem", display: "flex", flexDirection: "column", gap: "2px" }}>
                <span>• Mastery: 38% (weak threshold: 40%)</span>
                <span>• 3 consecutive failed attempts</span>
                <span>• Prerequisite for Graph algorithms</span>
              </div>
              <Link href="/dashboard/practice" className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                Start Session <ChevronRight size={14} />
              </Link>
            </div>

            {/* Subject mastery rings */}
            <div className="card">
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "1rem" }}>Subject Mastery</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {MASTERY.map(s => (
                  <div key={s.subject} style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <ProgressRing value={s.score} size={44} stroke={4} color={s.color} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 600, marginBottom: "3px" }}>
                        <span>{s.subject.split(" ")[0]}</span>
                        <span style={{ color: s.color }}>{s.score}%</span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{s.mastered}/{s.topics} topics mastered</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revision due */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>Review Due</h3>
                <Link href="/dashboard/revision" style={{ fontSize: "0.72rem", color: "var(--brand)", textDecoration: "none" }}>All revisions</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {REVISION_DUE.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem", borderRadius: "var(--radius-md)", background: r.urgent ? "var(--danger-muted)" : "var(--bg-subtle)", cursor: "pointer", transition: "all 150ms" }}>
                    <RotateCcw size={13} style={{ color: r.urgent ? "var(--danger)" : "var(--text-tertiary)", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>Recall ~{r.recall}%</div>
                    </div>
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, color: r.urgent ? "var(--danger)" : "var(--text-tertiary)" }}>{r.dueIn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gamification */}
            <div className="card" style={{ background: "var(--bg-subtle)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.875rem" }}>Your Progress</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--warning)" }}>{STUDENT.streak}</div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>Day Streak</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent)" }}>{STUDENT.xp.toLocaleString()}</div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>Total XP</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--brand)" }}>Lv. {STUDENT.level}</div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)" }}>Level</div>
                </div>
              </div>
              {/* XP bar to next level */}
              <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginBottom: "0.375rem", display: "flex", justifyContent: "space-between" }}>
                <span>XP to Level {STUDENT.level + 1}</span><span>3240 / 4000</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill progress-fill-accent" style={{ width: "81%" }} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="mobile-bottom-nav">
        {[
          { icon: LayoutDashboard, label: "Home", href: "/dashboard", active: true },
          { icon: BookOpen, label: "Learn", href: "/dashboard/courses" },
          { icon: Zap, label: "Practice", href: "/dashboard/practice" },
          { icon: Brain, label: "AI Tutor", href: "/dashboard/tutor" },
          { icon: Activity, label: "Profile", href: "/dashboard/profile" },
        ].map(({ icon: Icon, label, href, active }) => (
          <Link key={label} href={href} className={`mobile-nav-item ${active ? "active" : ""}`}>
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
