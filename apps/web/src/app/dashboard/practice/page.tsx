"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain, Target, Zap, RefreshCw, BookOpen, BarChart3, Award,
  CheckCircle2, XCircle, HelpCircle, Lightbulb, ArrowRight,
  RotateCcw, Sparkles, Timer, Flame, ChevronRight, LayoutDashboard,
  Check, Play, Layers, MessageSquare, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Question {
  id: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  statement: string;
  codeSnippet?: string;
  options: { id: string; text: string; explanation: string }[];
  correctOptionId: string;
  hints: string[];
  conceptKey: string;
}

const PRACTICE_QUESTIONS: Question[] = [
  {
    id: "q1",
    topic: "Recursion & Trees",
    difficulty: "Medium",
    statement: "What is the maximum number of recursive stack frames allocated in memory during an inorder traversal of a skewed binary tree containing N nodes?",
    codeSnippet: `def inorder(root):
    if not root:
        return
    inorder(root.left)
    print(root.val)
    inorder(root.right)`,
    options: [
      { id: "A", text: "O(log N)", explanation: "Incorrect. O(log N) only applies to perfectly balanced trees." },
      { id: "B", text: "O(N)", explanation: "Correct! In a degenerate/skewed tree (like a linked list), recursion depth equals N." },
      { id: "C", text: "O(1)", explanation: "Incorrect. Recursive calls require stack frames on the call stack." },
      { id: "D", text: "O(N²)", explanation: "Incorrect. Each node is visited only once during standard traversal." }
    ],
    correctOptionId: "B",
    hints: [
      "Consider the worst-case shape of a binary tree where every node has only a right child.",
      "Think about how many function call frames remain open before hitting the first base condition.",
      "In a line-like tree of N nodes, all N activation records stack up until reaching the leaf."
    ],
    conceptKey: "Recursion Call Stack Depth"
  },
  {
    id: "q2",
    topic: "Binary Search Trees",
    difficulty: "Medium",
    statement: "In a Binary Search Tree (BST), which traversal algorithm outputs the keys in strictly non-decreasing sorted order?",
    options: [
      { id: "A", text: "Preorder Traversal (Root → Left → Right)", explanation: "Incorrect. Preorder produces the root element before children." },
      { id: "B", text: "Postorder Traversal (Left → Right → Root)", explanation: "Incorrect. Postorder produces root after both subtrees." },
      { id: "C", text: "Inorder Traversal (Left → Root → Right)", explanation: "Correct! Because Left < Root < Right in a valid BST, Inorder produces monotonic sorted order." },
      { id: "D", text: "Level-Order BFS Traversal", explanation: "Incorrect. BFS visits level by level, not sorted order." }
    ],
    correctOptionId: "C",
    hints: [
      "Recall the core BST invariant: keys in left subtree < root < keys in right subtree.",
      "Which traversal pattern visits all smaller left elements first, then current root, then larger right elements?"
    ],
    conceptKey: "BST Inorder Monotonic Property"
  },
  {
    id: "q3",
    topic: "Dynamic Arrays",
    difficulty: "Easy",
    statement: "What is the amortized time complexity of appending an element to the end of a dynamic array (like Python list or C++ std::vector)?",
    options: [
      { id: "A", text: "O(1) Amortized", explanation: "Correct! While doubling capacity takes O(N), it happens exponentially infrequently, averaging O(1) per append." },
      { id: "B", text: "O(N) Strict", explanation: "Incorrect. O(N) only happens on rare reallocation steps, not on average." },
      { id: "C", text: "O(log N)", explanation: "Incorrect. Dynamic array lookup and append do not involve tree divisions." },
      { id: "D", text: "O(N log N)", explanation: "Incorrect. Appending does not sort the array." }
    ],
    correctOptionId: "A",
    hints: [
      "Remember that doubling capacity happens only when current array is 100% full.",
      "Aggregate analysis spreads the cost of copying over all prior insertions."
    ],
    conceptKey: "Amortized Complexity Analysis"
  },
  {
    id: "q4",
    topic: "Tree Height Calculation",
    difficulty: "Hard",
    statement: "Given the recursive definition below, what is returned for an empty tree (root = None)?",
    codeSnippet: `def max_depth(node):
    if not node:
        return 0
    return 1 + max(max_depth(node.left), max_depth(node.right))`,
    options: [
      { id: "A", text: "-1", explanation: "Incorrect. Some textbooks define height of empty tree as -1, but this specific function explicitly returns 0." },
      { id: "B", text: "0", explanation: "Correct! The base case `if not node: return 0` explicitly evaluates to 0." },
      { id: "C", text: "1", explanation: "Incorrect. A tree with a single root node returns 1, empty returns 0." },
      { id: "D", text: "NullPointerException / RecursionError", explanation: "Incorrect. The base condition cleanly terminates without error." }
    ],
    correctOptionId: "B",
    hints: [
      "Examine line 2-3 of the provided snippet carefully.",
      "Trace max_depth(None) directly through the first branch."
    ],
    conceptKey: "Base Case Boundary Execution"
  }
];

export default function PracticePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(3);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const currentQ = PRACTICE_QUESTIONS[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    setSelectedOption(optId);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOption === currentQ.correctOptionId) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < PRACTICE_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setRevealedHints(0);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setRevealedHints(0);
    setScore(0);
    setSessionCompleted(false);
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
        <Link href="/dashboard/practice" className="nav-item active">
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
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Zap size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Adaptive Practice Engine</h1>
              <p className="text-xs text-neutral-500">Dynamic difficulty scaling with instant reasoning feedback</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="warning" className="gap-1.5 py-1 px-3">
              <Flame size={14} /> {streak} Streak
            </Badge>
            <Badge variant="blue" className="gap-1.5 py-1 px-3">
              <Award size={14} /> {score * 50 + 200} XP
            </Badge>
          </div>
        </header>

        <main className="app-content">
          {!sessionCompleted ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Question Tracker & Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Question {currentIndex + 1} of {PRACTICE_QUESTIONS.length}
                    </span>
                    <Badge
                      variant={
                        currentQ.difficulty === "Easy"
                          ? "success"
                          : currentQ.difficulty === "Medium"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {currentQ.difficulty}
                    </Badge>
                  </div>

                  <span className="text-neutral-500">
                    Topic: <strong className="text-neutral-900 dark:text-neutral-100">{currentQ.topic}</strong>
                  </span>
                </div>

                <Progress value={((currentIndex + 1) / PRACTICE_QUESTIONS.length) * 100} className="h-1.5" />
              </div>

              {/* Question Card */}
              <Card className="shadow-sm">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-base font-bold leading-relaxed">{currentQ.statement}</CardTitle>
                </CardHeader>

                <CardContent className="p-6 pt-0 space-y-5">
                  {/* Code Snippet */}
                  {currentQ.codeSnippet && (
                    <div className="bg-neutral-950 text-neutral-100 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-neutral-800">
                      <pre className="m-0">{currentQ.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Multiple Choice Options */}
                  <div className="space-y-2.5">
                    {currentQ.options.map(opt => {
                      const isOptSelected = selectedOption === opt.id;
                      const showCorrect = isSubmitted && opt.id === currentQ.correctOptionId;
                      const showIncorrect = isSubmitted && isOptSelected && opt.id !== currentQ.correctOptionId;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectOption(opt.id)}
                          className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
                            showCorrect
                              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                              : showIncorrect
                              ? "border-destructive bg-destructive/10"
                              : isOptSelected
                              ? "border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-800/60"
                              : "border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900"
                          } ${isSubmitted ? "cursor-default" : "cursor-pointer"}`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                              showCorrect
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : showIncorrect
                                ? "border-destructive bg-destructive text-white"
                                : isOptSelected
                                ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                                : "border-neutral-300 dark:border-neutral-700 text-neutral-500"
                            }`}
                          >
                            {showCorrect ? <Check size={14} /> : showIncorrect ? <XCircle size={14} /> : opt.id}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                              {opt.text}
                            </div>
                            {isSubmitted && (
                              <div
                                className={`text-xs ${
                                  showCorrect
                                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                    : showIncorrect
                                    ? "text-destructive font-medium"
                                    : "text-neutral-500"
                                }`}
                              >
                                {opt.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Socratic Hint Box */}
                  <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <Lightbulb size={16} /> Socratic Hints ({revealedHints}/{currentQ.hints.length})
                      </div>
                      {revealedHints < currentQ.hints.length && !isSubmitted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRevealedHints(prev => prev + 1)}
                          className="h-7 text-xs border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                        >
                          Reveal Next Hint (+0 Penalty)
                        </Button>
                      )}
                    </div>

                    {revealedHints > 0 && (
                      <div className="space-y-1.5">
                        {currentQ.hints.slice(0, revealedHints).map((hint, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-neutral-600 dark:text-neutral-300 bg-amber-50/60 dark:bg-amber-950/20 border-l-2 border-amber-500 p-2.5 rounded-r-lg"
                          >
                            💡 <strong>Hint {idx + 1}:</strong> {hint}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-neutral-200/80 dark:border-neutral-800 mt-4 flex-wrap gap-3">
                  <Button asChild variant="ghost" size="sm" className="gap-2 text-blue-600 dark:text-blue-400">
                    <Link href="/dashboard/tutor">
                      <Brain size={15} /> Ask AI Tutor about this concept
                    </Link>
                  </Button>

                  <div>
                    {!isSubmitted ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                        size="sm"
                        className="px-6"
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button onClick={handleNext} size="sm" className="gap-2 px-6">
                        {currentIndex < PRACTICE_QUESTIONS.length - 1 ? "Next Question" : "Complete Drill"} <ChevronRight size={16} />
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>
          ) : (
            /* Session Completed Screen */
            <Card className="max-w-md mx-auto text-center p-8 shadow-sm">
              <CardContent className="p-0 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Award size={36} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">Drill Completed!</h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    You answered <strong className="text-neutral-900 dark:text-neutral-100">{score} / {PRACTICE_QUESTIONS.length}</strong> correctly ({Math.round((score / PRACTICE_QUESTIONS.length) * 100)}% accuracy).
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                    <div className="text-base font-extrabold text-blue-600 dark:text-blue-400">+{score * 50}</div>
                    <div className="text-[10px] text-neutral-500 uppercase font-semibold">XP Earned</div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                    <div className="text-base font-extrabold text-amber-600 dark:text-amber-400">{streak} 🔥</div>
                    <div className="text-[10px] text-neutral-500 uppercase font-semibold">Streak</div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                    <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">+6%</div>
                    <div className="text-[10px] text-neutral-500 uppercase font-semibold">Mastery</div>
                  </div>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <Button variant="outline" size="sm" onClick={handleRestart} className="gap-2">
                    <RotateCcw size={14} /> Practice Again
                  </Button>
                  <Button asChild size="sm" className="gap-2">
                    <Link href="/dashboard/path">
                      <Target size={14} /> View Updated Path
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
