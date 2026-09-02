"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain, Flame, Bell, Sun, Moon, Monitor, BookOpen, Target,
  BarChart3, Activity, RefreshCw, Award, Settings, LogOut,
  ChevronRight, Zap, Clock, TrendingUp, AlertCircle, CheckCircle2,
  PlayCircle, RotateCcw, Star, ArrowUp, Calendar, Menu, X,
  GraduationCap, MessageSquare, Users, LayoutDashboard, Sparkles
} from "lucide-react";
import { useTheme } from "next-themes";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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

export default function StudentDashboard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const themeIcon = !mounted ? null : theme === "dark" ? <Sun size={15} /> : <Moon size={15} />;
  const nextTheme = !mounted ? "light" : theme === "dark" ? "light" : "dark";

  return (
    <div className="app-shell">
      {/* ─── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="app-sidebar">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-neutral-950 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-950 flex items-center justify-center font-bold">
            <Brain size={16} />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-neutral-50">AdaptiveX AI</span>
        </div>

        <div className="nav-section-label">Learning</div>
        <Link href="/dashboard" className="nav-item active">
          <LayoutDashboard size={16} className="nav-icon" /> Dashboard
        </Link>
        <Link href="/dashboard/path" className="nav-item">
          <Target size={16} className="nav-icon" /> Learning Path
        </Link>
        <Link href="/dashboard/tutor" className="nav-item">
          <Brain size={16} className="nav-icon" /> AI Tutor
        </Link>
        <Link href="/dashboard/practice" className="nav-item">
          <Zap size={16} className="nav-icon" /> Practice
        </Link>
        <Link href="/dashboard/revision" className="nav-item">
          <RefreshCw size={16} className="nav-icon" /> Revision
        </Link>

        <div className="nav-section-label mt-3">Account</div>
        <Link href="/dashboard" className="nav-item">
          <BarChart3 size={16} className="nav-icon" /> Analytics
        </Link>
        <Link href="/dashboard" className="nav-item">
          <Award size={16} className="nav-icon" /> Achievements
        </Link>

        <div className="mt-auto pt-4">
          <Separator className="mb-3" />
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 text-xs font-bold">
                AS
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">{STUDENT.name}</div>
              <div className="text-[11px] text-neutral-500">Level {STUDENT.level} · {STUDENT.xp.toLocaleString()} XP</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <div className="app-main">
        <header className="app-header justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
              <LayoutDashboard size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Learner Overview</div>
              <p className="text-[11px] text-neutral-500">Adaptive analytics and active goals</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="warning" className="gap-1.5 py-1 px-3">
              <Flame size={14} /> {STUDENT.streak} Day Streak
            </Badge>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(nextTheme)}
              title="Toggle theme"
            >
              {themeIcon}
            </Button>
          </div>
        </header>

        <main className="app-content space-y-6">
          {/* Greeting and Goal Bar */}
          <div className="space-y-1">
            <p className="text-xs text-neutral-500">Good day, learner 👋</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">{STUDENT.name}</h1>
            <div className="flex items-center gap-3 pt-1 text-xs text-neutral-600 dark:text-neutral-400 flex-wrap">
              <span>Weekly Goal Progress: <strong className="text-neutral-900 dark:text-neutral-100">{STUDENT.weeklyGoalPct}%</strong></span>
              <div className="w-36">
                <Progress value={STUDENT.weeklyGoalPct} className="h-1.5" />
              </div>
              <span className="text-neutral-400">{STUDENT.weeklyStudied}h / {STUDENT.weeklyGoal}h studied</span>
            </div>
          </div>

          {/* Grid Layout: Main Columns vs Right Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Col (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Daily Adaptive Plan */}
              <Card className="shadow-sm">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Today's Adaptive Plan</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">3 Focus Tasks</Badge>
                  </div>
                  <CardDescription className="text-xs">Optimized for maximum retention and concept reinforcement</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-2.5">
                  {TODAY_PLAN.map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          {i + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{task.title}</div>
                          <div className="text-[11px] text-neutral-500">{task.reason}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-[10px]">{task.time}</Badge>
                        <Button asChild size="sm" variant="ghost" className="h-7 text-xs gap-1">
                          <Link href={task.type === "practice" ? "/dashboard/practice" : "/dashboard/revision"}>
                            Start <ChevronRight size={13} />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Progress Analytics Chart */}
              <Card className="shadow-sm">
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Subject Mastery Trajectory</CardTitle>
                    <Badge variant="outline" className="text-[10px]">Last 7 Days</Badge>
                  </div>
                  <CardDescription className="text-xs">Knowledge retention over time</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-2">
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={PROGRESS_DATA}>
                        <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[40, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="dsa" stroke="hsl(221,83%,53%)" strokeWidth={2} dot={false} name="DSA" />
                        <Line type="monotone" dataKey="dbms" stroke="hsl(142,68%,45%)" strokeWidth={2} dot={false} name="DBMS" />
                        <Line type="monotone" dataKey="os" stroke="hsl(38,92%,50%)" strokeWidth={2} dot={false} name="OS" />
                        <Line type="monotone" dataKey="cn" stroke="hsl(199,89%,48%)" strokeWidth={2} dot={false} name="CN" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Col (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* AI Recommendation Card */}
              <Card className="border-blue-500/30 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm">
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center">
                        <Brain size={14} />
                      </div>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">AI Recommendation</span>
                    </div>
                    <Badge variant="blue" className="text-[10px] font-semibold">Personalized</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-3">
                  <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 leading-relaxed">
                    Practice <strong>Binary Trees</strong> for 20 minutes before starting new topics. Your recursive foundations need strengthening first.
                  </p>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-1">
                    <div>• Mastery: 38% (weak threshold: 40%)</div>
                    <div>• 3 consecutive failed attempts</div>
                    <div>• Prerequisite for Graph algorithms</div>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  <Button asChild size="sm" className="w-full gap-1.5 shadow-sm">
                    <Link href="/dashboard/practice">
                      Start Session <ChevronRight size={14} />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Subject Mastery List */}
              <Card className="shadow-sm">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-sm font-bold">Subject Mastery</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-3">
                  {MASTERY.map(s => (
                    <div key={s.subject} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-neutral-700 dark:text-neutral-300">{s.subject}</span>
                        <span className="text-neutral-900 dark:text-neutral-100 font-bold">{s.score}%</span>
                      </div>
                      <Progress value={s.score} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Review Due List */}
              <Card className="shadow-sm">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Review Due</CardTitle>
                    <Link href="/dashboard/revision" className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                      All Cards
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-2">
                  {REVISION_DUE.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800">
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{r.name}</div>
                        <div className="text-[10px] text-neutral-500">Recall ~{r.recall}%</div>
                      </div>
                      <Badge variant={r.urgent ? "destructive" : "secondary"} className="text-[10px]">
                        {r.dueIn}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
