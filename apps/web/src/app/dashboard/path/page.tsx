"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain, Target, Zap, RefreshCw, BookOpen, BarChart3, Award,
  CheckCircle2, Lock, ArrowRight, Sparkles, Clock, Flame,
  AlertTriangle, ChevronRight, Play, BookMarked, Layers,
  Compass, Share2, Filter, Info, Star, LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

// ─── Curriculum Data ────────────────────────────────────────────────────────
interface ConceptNode {
  id: string;
  title: string;
  category: string;
  mastery: number;
  status: "mastered" | "in_progress" | "locked";
  estimatedTime: string;
  prerequisites: string[];
  description: string;
  misconceptions: string[];
  recommendedAction: {
    label: string;
    href: string;
  };
}

const SUBJECTS = [
  { id: "dsa", name: "Data Structures & Algorithms", icon: Layers, progress: 71, color: "text-blue-600 dark:text-blue-400" },
  { id: "dbms", name: "Database Management Systems", icon: BookOpen, progress: 82, color: "text-emerald-600 dark:text-emerald-400" },
  { id: "os", name: "Operating Systems", icon: Compass, progress: 57, color: "text-amber-600 dark:text-amber-400" },
  { id: "cn", name: "Computer Networks", icon: Share2, progress: 64, color: "text-cyan-600 dark:text-cyan-400" },
];

const DSA_NODES: ConceptNode[] = [
  {
    id: "arrays",
    title: "Dynamic Arrays & Memory",
    category: "Linear Structures",
    mastery: 95,
    status: "mastered",
    estimatedTime: "25 min",
    prerequisites: ["Time Complexity Basics"],
    description: "Contiguous memory allocation, resizing amortization O(1), and cache locality.",
    misconceptions: ["Confusing static vs dynamic array capacity reallocation costs"],
    recommendedAction: { label: "Review Array Challenges", href: "/dashboard/practice" }
  },
  {
    id: "linked-lists",
    title: "Singly & Doubly Linked Lists",
    category: "Linear Structures",
    mastery: 90,
    status: "mastered",
    estimatedTime: "30 min",
    prerequisites: ["Pointers & Memory"],
    description: "Node manipulation, fast/slow pointer cycle detection, in-place reversal.",
    misconceptions: ["Losing the next pointer reference during multi-node pointer swaps"],
    recommendedAction: { label: "Refresh 2-Pointer Cycle Detection", href: "/dashboard/revision" }
  },
  {
    id: "recursion",
    title: "Recursion & Call Stack",
    category: "Algorithmic Paradigms",
    mastery: 43,
    status: "in_progress",
    estimatedTime: "45 min",
    prerequisites: ["Stacks", "Function Call Frames"],
    description: "Stack unwinding, base condition formulation, and recursion tree branch analysis.",
    misconceptions: ["Missing base conditions causing stack overflow", "Inefficient repeated subtree computation"],
    recommendedAction: { label: "Interactive Socratic Tutor Session", href: "/dashboard/tutor" }
  },
  {
    id: "binary-trees",
    title: "Binary Trees & Traversals",
    category: "Hierarchical Structures",
    mastery: 38,
    status: "in_progress",
    estimatedTime: "40 min",
    prerequisites: ["Recursion & Call Stack"],
    description: "Inorder, Preorder, Postorder, and Level-Order BFS traversal using queues.",
    misconceptions: ["Confusing DFS recursion order with BFS level order", "Edge cases with unbalanced trees"],
    recommendedAction: { label: "Debug Tree Misconceptions with AI", href: "/dashboard/tutor" }
  },
  {
    id: "bst",
    title: "Binary Search Trees (BST)",
    category: "Hierarchical Structures",
    mastery: 50,
    status: "in_progress",
    estimatedTime: "35 min",
    prerequisites: ["Binary Trees & Traversals"],
    description: "BST invariant (left < root < right), search, insertion, and deletion by predecessor.",
    misconceptions: ["Assuming simple in-order comparison without checking full sub-tree validity"],
    recommendedAction: { label: "Solve BST Validation Quiz", href: "/dashboard/practice" }
  },
  {
    id: "avl-trees",
    title: "Self-Balancing AVL Trees",
    category: "Advanced Trees",
    mastery: 0,
    status: "locked",
    estimatedTime: "50 min",
    prerequisites: ["Binary Search Trees (BST)"],
    description: "Balance factors (-1, 0, 1), LL, RR, LR, RL single and double tree rotations.",
    misconceptions: ["Applying single rotation when sub-tree has opposite zigzag skew"],
    recommendedAction: { label: "Master BST First to Unlock", href: "/dashboard/tutor" }
  },
  {
    id: "graphs-bfs-dfs",
    title: "Graph Search: BFS & DFS",
    category: "Graphs",
    mastery: 0,
    status: "locked",
    estimatedTime: "60 min",
    prerequisites: ["Binary Trees & Traversals", "Queue & Stack"],
    description: "Adjacency matrix vs list, visited sets, cycle detection in directed graphs.",
    misconceptions: ["Missing visited check causing infinite traversal in cyclic graphs"],
    recommendedAction: { label: "Locked: Complete Tree Modules", href: "/dashboard/tutor" }
  },
  {
    id: "dp-intro",
    title: "Dynamic Programming (Memoization)",
    category: "Advanced Algorithms",
    mastery: 0,
    status: "locked",
    estimatedTime: "75 min",
    prerequisites: ["Recursion & Call Stack"],
    description: "Overlapping subproblems, optimal substructure, top-down memoization vs bottom-up tabulation.",
    misconceptions: ["Attempting DP on problems lacking optimal substructure"],
    recommendedAction: { label: "Locked: Complete Recursion First", href: "/dashboard/tutor" }
  }
];

export default function LearningPathPage() {
  const [selectedSubject, setSelectedSubject] = useState("dsa");
  const [selectedNode, setSelectedNode] = useState<ConceptNode>(DSA_NODES[3]); // Binary Trees
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const activeSubject = SUBJECTS.find(s => s.id === selectedSubject) || SUBJECTS[0];

  const filteredNodes = DSA_NODES.filter(node => {
    if (filterStatus === "all") return true;
    return node.status === filterStatus;
  });

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
        <Link href="/dashboard/path" className="nav-item active">
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
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Target size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Adaptive Knowledge Graph</h1>
              <p className="text-xs text-neutral-500">Sequenced dynamically via Bayesian Knowledge Tracing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="warning" className="gap-1.5 py-1 px-3">
              <Flame size={14} /> 14 Day Streak
            </Badge>
            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard/tutor">
                <Sparkles size={14} /> Ask Socratic AI
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main className="app-content space-y-6">
          {/* ─── AI Diagnostic Recommendation Banner ─────────────────────── */}
          <Card className="border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm">
            <CardContent className="p-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-start gap-4 max-w-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles size={20} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="blue" className="text-[10px] uppercase font-bold tracking-wider">
                      AI Diagnostic Alert
                    </Badge>
                    <Badge variant="destructive" className="text-[10px] font-semibold">
                      Bottleneck Detected
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Strengthen "Binary Trees" before advancing to Self-Balancing AVL Trees
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Your current mastery is 38%. Socratic AI detected hesitation in recursive subtree height calculations during your last practice session.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild size="sm" className="gap-1.5 shadow-sm">
                  <Link href="/dashboard/tutor">
                    <Brain size={15} /> Resolve with AI Tutor
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ─── Subject Selector Cards ──────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SUBJECTS.map(subj => {
              const Icon = subj.icon;
              const isSelected = selectedSubject === subj.id;
              return (
                <Card
                  key={subj.id}
                  onClick={() => setSelectedSubject(subj.id)}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? "ring-2 ring-neutral-900 dark:ring-neutral-100 border-transparent shadow-sm"
                      : "hover:border-neutral-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 ${subj.color}`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-xs font-extrabold text-neutral-900 dark:text-neutral-100">{subj.progress}%</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">{subj.name}</div>
                      <Progress value={subj.progress} className="h-1.5 mt-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* ─── Main Roadmap Grid & Detail Sheet ───────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Sequential Node Pathway */}
            <Card className="lg:col-span-7">
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-bold">{activeSubject.name}</CardTitle>
                  <CardDescription className="text-xs">Click any concept node to inspect knowledge states</CardDescription>
                </div>

                <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                  {["all", "in_progress", "mastered", "locked"].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterStatus(f)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all capitalize ${
                        filterStatus === f
                          ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                      }`}
                    >
                      {f.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-3 space-y-2.5">
                {filteredNodes.map((node, index) => {
                  const isSelected = selectedNode.id === node.id;
                  const isMastered = node.status === "mastered";
                  const isInProgress = node.status === "in_progress";
                  const isLocked = node.status === "locked";

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-800/60 shadow-sm"
                          : isLocked
                          ? "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 opacity-70"
                          : "border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isMastered
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : isInProgress
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                        }`}>
                          {isMastered ? <CheckCircle2 size={18} /> : isLocked ? <Lock size={14} /> : `${index + 1}`}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{node.title}</span>
                            <Badge variant="outline" className="text-[10px] font-medium py-0 px-2">
                              {node.category}
                            </Badge>
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            {node.prerequisites.length > 0 ? `Requires: ${node.prerequisites.join(", ")}` : "Foundational Concept"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                            {isLocked ? "Locked" : `${node.mastery}%`}
                          </div>
                          <div className="text-[11px] text-neutral-400">{node.estimatedTime}</div>
                        </div>
                        <ChevronRight size={16} className="text-neutral-400" />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Right: Selected Node Detail Sheet */}
            <Card className="lg:col-span-5 sticky top-20 shadow-sm">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="blue" className="text-[10px] font-bold uppercase tracking-wider">
                    Node Knowledge Spec
                  </Badge>
                  <Badge
                    variant={
                      selectedNode.status === "mastered"
                        ? "success"
                        : selectedNode.status === "in_progress"
                        ? "blue"
                        : "secondary"
                    }
                    className="capitalize font-semibold"
                  >
                    {selectedNode.status.replace("_", " ")}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-extrabold">{selectedNode.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed mt-1">{selectedNode.description}</CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4">
                {/* Mastery Meter */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-neutral-600 dark:text-neutral-400">Bayesian Mastery Score</span>
                    <span className="text-neutral-900 dark:text-neutral-100">{selectedNode.mastery}%</span>
                  </div>
                  <Progress value={selectedNode.mastery} className="h-2" />
                </div>

                {/* Misconception Warnings */}
                {selectedNode.misconceptions.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <AlertTriangle size={14} /> Diagnostic Misconceptions
                    </div>
                    {selectedNode.misconceptions.map((m, i) => (
                      <div key={i} className="text-xs text-neutral-600 dark:text-neutral-300 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-lg">
                        • {m}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-5 pt-0 flex-col gap-2">
                <Button asChild className="w-full gap-2 shadow-sm">
                  <Link href={selectedNode.recommendedAction.href}>
                    <Brain size={16} /> {selectedNode.recommendedAction.label}
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button asChild variant="outline" size="sm" className="gap-1.5">
                    <Link href="/dashboard/practice">
                      <Zap size={14} /> Practice Drill
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="gap-1.5">
                    <Link href="/dashboard/revision">
                      <RefreshCw size={14} /> Flashcards
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
