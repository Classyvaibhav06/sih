"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain, Target, Zap, RefreshCw, BookOpen, BarChart3, Award,
  CheckCircle2, Clock, RotateCw, Sparkles, Flame, Volume2,
  ChevronRight, ArrowLeft, ArrowRight, BookMarked, Layers,
  LayoutDashboard, ThumbsUp, AlertCircle, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

interface Flashcard {
  id: string;
  topic: string;
  subtopic: string;
  question: string;
  answer: string;
  codeSnippet?: string;
  keyTakeaway: string;
  retentionScore: number;
  intervalDays: number;
  dueStatus: "Urgent" | "Due Today" | "Tomorrow" | "Mastered";
}

const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: "fc-1",
    topic: "Data Structures",
    subtopic: "Binary Search",
    question: "How do you avoid integer overflow when calculating mid index in Binary Search?",
    answer: "Instead of writing `mid = (low + high) // 2`, write `mid = low + (high - low) // 2`.",
    codeSnippet: `# Correct overflow-safe implementation
mid = low + (high - low) // 2`,
    keyTakeaway: "Prevents (low + high) exceeding 32-bit MAX_INT (2,147,483,647) when searching large arrays.",
    retentionScore: 63,
    intervalDays: 1,
    dueStatus: "Urgent"
  },
  {
    id: "fc-2",
    topic: "Database Systems",
    subtopic: "Normalization",
    question: "What is the key criterion for a table to satisfy Boyce-Codd Normal Form (BCNF)?",
    answer: "For every non-trivial functional dependency X → Y, X must be a Super Key of the relation.",
    keyTakeaway: "BCNF is a stricter version of 3NF that eliminates all redundancy based on functional dependencies.",
    retentionScore: 71,
    intervalDays: 2,
    dueStatus: "Due Today"
  },
  {
    id: "fc-3",
    topic: "Operating Systems",
    subtopic: "Process Scheduling",
    question: "What are the 4 necessary and sufficient conditions for a Deadlock to occur (Coffman conditions)?",
    answer: "1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait",
    keyTakeaway: "Breaking even ONE of these four conditions prevents deadlock from ever occurring.",
    retentionScore: 78,
    intervalDays: 3,
    dueStatus: "Tomorrow"
  },
  {
    id: "fc-4",
    topic: "Data Structures",
    subtopic: "Tree Traversals",
    question: "What auxiliary data structure is required for Level-Order (BFS) tree traversal and why?",
    answer: "A Queue (FIFO) is required to process nodes in the order they are discovered level by level.",
    codeSnippet: `from collections import deque

def level_order(root):
    if not root: return []
    q = deque([root])
    # FIFO queue ensures level-by-level processing`,
    keyTakeaway: "BFS uses Queue (FIFO), whereas DFS recursive traversal utilizes the call stack (LIFO).",
    retentionScore: 55,
    intervalDays: 1,
    dueStatus: "Urgent"
  }
];

export default function RevisionPage() {
  const [cards, setCards] = useState<Flashcard[]>(FLASHCARDS_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const currentCard = cards[currentIndex];

  const handleRate = (rating: "again" | "hard" | "good" | "easy") => {
    setIsFlipped(false);
    setReviewedCount(prev => prev + 1);

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionDone(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);
    setSessionDone(false);
  };

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
        <Link href="/dashboard" className="nav-item">
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
        <Link href="/dashboard/revision" className="nav-item active">
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
              <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">Aarav Sharma</div>
              <div className="text-[11px] text-neutral-500">Level 12 · 3,240 XP</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <div className="app-main">
        <header className="app-header justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <RefreshCw size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Spaced Repetition Engine</h1>
              <p className="text-xs text-neutral-500">SuperMemo SM-2 & FSRS memory decay curve optimization</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="gap-1.5 py-1 px-3">
              <Clock size={14} /> 4 Cards Due
            </Badge>
            <ThemeToggle />
          </div>
        </header>

        <main className="app-content space-y-6">
          {/* ─── Metric Cards ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-1">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Overall Retention</div>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">84.2%</div>
                <div className="text-[11px] text-neutral-500">Target: ≥ 85% stability</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-1">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Due For Review</div>
                <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">4 Cards</div>
                <div className="text-[11px] text-neutral-500">2 Urgent high-decay concepts</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-1">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Streak Reviews</div>
                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">14 Days</div>
                <div className="text-[11px] text-neutral-500">+150 XP bonus earned</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-1">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Long-Term Stored</div>
                <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">48 Concepts</div>
                <div className="text-[11px] text-neutral-500">Intervals &gt; 30 days</div>
              </CardContent>
            </Card>
          </div>

          {/* ─── Flashcard Review Workspace ───────────────────────────────── */}
          {!sessionDone ? (
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-neutral-700 dark:text-neutral-300">
                  Card {currentIndex + 1} of {cards.length}
                </span>
                <Badge
                  variant={currentCard.dueStatus === "Urgent" ? "destructive" : "blue"}
                  className="font-medium"
                >
                  {currentCard.dueStatus} · {currentCard.retentionScore}% Memory Recall
                </Badge>
              </div>

              <Progress value={((currentIndex + 1) / cards.length) * 100} className="h-1.5" />

              {/* 3D Interactive Flip Card */}
              <Card
                onClick={() => setIsFlipped(prev => !prev)}
                className={`min-h-[320px] p-8 flex flex-col justify-between cursor-pointer transition-all ${
                  isFlipped
                    ? "border-blue-500/50 bg-blue-50/20 dark:bg-blue-950/10 shadow-md"
                    : "hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-[11px] font-bold uppercase tracking-wider">
                      {currentCard.topic} • {currentCard.subtopic}
                    </Badge>
                    <span className="text-xs text-neutral-400">
                      {isFlipped ? "Click to view Question" : "Click to Reveal Answer"}
                    </span>
                  </div>

                  {!isFlipped ? (
                    // Front of card
                    <div className="py-6 space-y-4">
                      <h2 className="text-lg font-bold leading-relaxed text-neutral-900 dark:text-neutral-100">
                        {currentCard.question}
                      </h2>
                      <p className="text-xs text-neutral-500">
                        💡 Think through the core mechanism before flipping to verify your mental model...
                      </p>
                    </div>
                  ) : (
                    // Back of card
                    <div className="py-2 space-y-4">
                      <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-relaxed whitespace-pre-line">
                        {currentCard.answer}
                      </div>

                      {currentCard.codeSnippet && (
                        <div className="bg-neutral-950 text-neutral-100 p-3.5 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-neutral-800">
                          <pre className="m-0">{currentCard.codeSnippet}</pre>
                        </div>
                      )}

                      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
                        🎯 <strong>Memory Key:</strong> {currentCard.keyTakeaway}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-neutral-200/80 dark:border-neutral-800 pt-4 mt-6 text-xs text-neutral-500">
                  <div>
                    FSRS Interval: <strong className="text-neutral-900 dark:text-neutral-100">{currentCard.intervalDays} day(s)</strong>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold">
                    {isFlipped ? "Rate your recall below ⬇️" : "Flip card to rate recall 🔄"}
                  </div>
                </div>
              </Card>

              {/* SM-2 / FSRS Rating Controls */}
              {isFlipped && (
                <div className="grid grid-cols-4 gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleRate("again")}
                    className="flex-col h-auto py-3 border-destructive/30 hover:bg-destructive/10 text-destructive"
                  >
                    <span className="font-bold text-xs">Again</span>
                    <span className="text-[10px] opacity-75">&lt; 1 min</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleRate("hard")}
                    className="flex-col h-auto py-3 border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                  >
                    <span className="font-bold text-xs">Hard</span>
                    <span className="text-[10px] opacity-75">12 hours</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleRate("good")}
                    className="flex-col h-auto py-3 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                  >
                    <span className="font-bold text-xs">Good</span>
                    <span className="text-[10px] opacity-75">2 days</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleRate("easy")}
                    className="flex-col h-auto py-3 border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                  >
                    <span className="font-bold text-xs">Easy</span>
                    <span className="text-[10px] opacity-75">4 days (+25 XP)</span>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Review Complete Screen */
            <Card className="max-w-md mx-auto text-center p-8 shadow-sm">
              <CardContent className="p-0 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">Daily Review Complete!</h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    All <strong>{cards.length} cards</strong> due for today have been reviewed. Memory decay intervals have been calibrated.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                    <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">+100 XP</div>
                    <div className="text-[10px] text-neutral-500 uppercase font-semibold">Daily Goal</div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                    <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">88.5%</div>
                    <div className="text-[10px] text-neutral-500 uppercase font-semibold">Stability Score</div>
                  </div>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                    <RefreshCw size={14} /> Review Again
                  </Button>
                  <Button asChild size="sm" className="gap-2">
                    <Link href="/dashboard">
                      <LayoutDashboard size={14} /> Back to Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
