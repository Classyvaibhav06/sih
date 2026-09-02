"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Brain, Send, Mic, Sparkles, BookOpen, RefreshCw, Target,
  Lightbulb, HelpCircle, FileText, Loader2,
  RotateCcw, Copy, Check,
  LayoutDashboard, Zap, BarChart3, Award, PanelRight, ChevronRight,
  Sliders, Layers, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Mermaid from "@/components/ui/mermaid";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Source[];
  isStreaming?: boolean;
  isDemo?: boolean;
}

interface Source {
  title: string;
  chapter: string;
  url?: string;
}

const QUICK_ACTIONS = [
  { label: "Explain simply", icon: Lightbulb, prompt: "Explain this in the simplest possible way with an easy analogy" },
  { label: "Show diagram", icon: Layers, prompt: "Show a visual concept diagram using Mermaid to explain how this works" },
  { label: "Quiz me", icon: Target, prompt: "Ask me a targeted practice question on this concept to test my understanding" },
  { label: "Give example", icon: BookOpen, prompt: "Give me a real-world code example that makes this crystal clear" },
  { label: "Hint", icon: HelpCircle, prompt: "Give me a Socratic hint without giving away the full answer" },
  { label: "Compare concepts", icon: RefreshCw, prompt: "Compare this with a related concept I might confuse it with" },
];

const CONTEXT = {
  course: "Computer Science & Engineering",
  topic: "Binary Trees & Recursion",
  mastery: 43,
  subtopic: "Tree Traversal & Call Stacks",
  previousMistake: "Confused DFS with BFS traversal in the last diagnostic drill",
  prerequisites: [
    { name: "Pointers & References", mastery: 85, status: "Mastered" },
    { name: "Function Call Stacks", mastery: 64, status: "Proficient" },
    { name: "Recursive Base Cases", mastery: 43, status: "Needs Practice" },
  ],
};

function TypingDots() {
  return (
    <div className="flex gap-1.5 items-center py-2 px-1">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  return (
    <div className="text-xs sm:text-sm leading-relaxed text-neutral-900 dark:text-neutral-100 max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-50 mt-4 mb-2 pb-1 border-b border-neutral-200 dark:border-neutral-800">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 mt-3 mb-1.5">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-2.5 mb-1">
              {children}
            </h4>
          ),
          h4: ({ children }) => (
            <h5 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-2 mb-0.5">
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="my-2 text-neutral-800 dark:text-neutral-200 leading-relaxed">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-neutral-950 dark:text-neutral-50">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="my-2 space-y-1.5 pl-4 list-disc marker:text-blue-500">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 space-y-1.5 pl-4 list-decimal marker:text-blue-500 font-medium">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-neutral-800 dark:text-neutral-200 pl-1 leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-3 border-blue-500 pl-3.5 py-2 bg-blue-50/70 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 rounded-r-xl text-xs sm:text-sm">
              {children}
            </blockquote>
          ),
          hr: () => <Separator className="my-4" />,
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
              <table className="w-full text-left text-xs border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-neutral-100/90 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-bold">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-neutral-200/70 dark:divide-neutral-800">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 font-bold text-neutral-900 dark:text-neutral-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-neutral-700 dark:text-neutral-300">
              {children}
            </td>
          ),
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const lang = match ? match[1] : "";

            if (!inline && lang === "mermaid") {
              return <Mermaid chart={codeString} />;
            }

            if (!inline && (match || codeString.includes("\n"))) {
              return (
                <div className="bg-neutral-950 text-neutral-100 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-neutral-800 my-3 shadow-sm">
                  {lang && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      <span>{lang}</span>
                    </div>
                  )}
                  <pre className="m-0 font-mono whitespace-pre leading-relaxed">{codeString}</pre>
                </div>
              );
            }
            return (
              <code
                className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-1.5 py-0.5 rounded text-[11px] font-mono border border-neutral-200 dark:border-neutral-700 font-semibold"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m0",
      role: "assistant",
      content: "Hello Aarav! I'm your **AdaptiveX Socratic Tutor**. I see you're currently mastering **Binary Trees & Recursion** (43% mastery). What concept or question would you like to explore today?",
      timestamp: new Date(),
      sources: [
        { title: "Introduction to Algorithms (CLRS)", chapter: "Chapter 12 — Binary Search Trees" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: `u_${Date.now()}`, role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const botMsgId = `a_${Date.now()}`;
    setMessages(prev => [
      ...prev,
      { id: botMsgId, role: "assistant", content: "", timestamp: new Date(), isStreaming: true },
    ]);

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversation_history: messages.slice(1).map(m => ({ role: m.role, content: m.content })),
          conceptKey: CONTEXT.topic,
          stream: true,
        }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || "Tutor API returned an error");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamed = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(dataStr);
              const delta =
                parsed.choices?.[0]?.delta?.content ||
                parsed.chunk ||
                "";
              if (delta) {
                streamed += delta;
                setMessages(prev =>
                  prev.map(m => (m.id === botMsgId ? { ...m, content: streamed, isStreaming: false } : m))
                );
              }
            } catch {
              // Ignore partial chunk
            }
          }
        }
      }
    } catch (err: any) {
      setMessages(prev =>
        prev.map(m =>
          m.id === botMsgId
            ? {
                ...m,
                content: `⚠️ Could not reach AI Tutor: ${err.message || "Please verify backend connection."}`,
                isStreaming: false,
                isDemo: false,
              }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-950 font-sans">
      {/* ─── Left Navigation Sidebar ───────────────────────────────────────── */}
      <aside className="w-60 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col shrink-0 h-full p-4 overflow-y-auto">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
            <Brain size={18} />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-neutral-50">
            AdaptiveX AI
          </span>
        </div>

        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 mb-2">
          Learning
        </div>
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <LayoutDashboard size={15} /> Dashboard
          </Link>
          <Link
            href="/dashboard/path"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Target size={15} /> Learning Path
          </Link>
          <Link
            href="/dashboard/tutor"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60"
          >
            <Brain size={15} /> AI Tutor
          </Link>
          <Link
            href="/dashboard/practice"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Zap size={15} /> Practice
          </Link>
          <Link
            href="/dashboard/revision"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <RefreshCw size={15} /> Revision
          </Link>
        </div>

        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 mt-6 mb-2">
          Account
        </div>
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <BarChart3 size={15} /> Analytics
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Award size={15} /> Achievements
          </Link>
        </div>

        <div className="mt-auto pt-4">
          <Separator className="mb-3" />
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 text-xs font-bold">
                AS
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                Aarav Sharma
              </div>
              <div className="text-[11px] text-neutral-500">Level 12 · 3,240 XP</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Central Chat & Work Area ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Sleek Header */}
        <header className="h-16 px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Brain size={19} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Socratic AI Tutor
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                <span>Model:</span>
                <code className="text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-neutral-700 dark:text-neutral-300">
                  z-ai/glm-5.3-free
                </code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Badge variant="blue" className="hidden sm:inline-flex gap-1 items-center text-[11px] px-2.5 py-1">
              <Sparkles size={12} /> Socratic Mode
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessages(messages.slice(0, 1))}
              className="gap-1.5 h-9 rounded-xl text-xs text-neutral-700 dark:text-neutral-300"
              title="Clear conversation history"
            >
              <RotateCcw size={13} /> <span className="hidden sm:inline">Reset</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowContextPanel(!showContextPanel)}
              className={`h-9 w-9 rounded-xl text-neutral-700 dark:text-neutral-300 hidden lg:flex ${showContextPanel ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}
              title={showContextPanel ? "Hide Cognitive Context Panel" : "Show Cognitive Context Panel"}
            >
              <PanelRight size={15} />
            </Button>

            <ThemeToggle />
          </div>
        </header>

        {/* Workspace Body: Chat Stream + Context Panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat Stream Container */}
          <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
            {/* Scrollable Conversation View */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 bg-neutral-50/60 dark:bg-neutral-950/60">
              <div className="max-w-4xl mx-auto space-y-6 pb-6">
                {messages.map(m => {
                  const isUser = m.role === "user";
                  return (
                    <div key={m.id} className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}>
                      {!isUser && (
                        <Avatar className="h-8 w-8 shrink-0 mt-1 shadow-sm">
                          <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={`space-y-1.5 ${isUser ? "max-w-2xl ml-auto" : "w-full max-w-3xl"}`}>
                        <div
                          className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm ${
                            isUser
                              ? "bg-blue-600 text-white rounded-tr-sm shadow-md font-medium leading-relaxed"
                              : "bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-tl-sm shadow-sm"
                          }`}
                        >
                          {m.isStreaming ? <TypingDots /> : <MessageContent content={m.content} />}
                        </div>

                        {!isUser && !m.isStreaming && (
                          <div className="flex items-center gap-3 px-1.5 pt-0.5 text-[11px] text-neutral-400">
                            <button
                              onClick={() => copyToClipboard(m.content, m.id)}
                              className="hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1 transition-colors"
                            >
                              {copiedId === m.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                              {copiedId === m.id ? "Copied" : "Copy response"}
                            </button>
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <Avatar className="h-8 w-8 shrink-0 mt-1 shadow-sm">
                          <AvatarFallback className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-bold">
                            AS
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
                <div ref={bottomRef} className="h-4" />
              </div>
            </div>

            {/* Bottom Controls Area */}
            <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl z-10">
              {/* Quick Action Suggestion Pills */}
              <div className="px-4 sm:px-8 py-2.5 flex gap-2 overflow-x-auto border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/20">
                {QUICK_ACTIONS.map(a => (
                  <Button
                    key={a.label}
                    variant="outline"
                    size="sm"
                    onClick={() => send(a.prompt)}
                    disabled={loading}
                    className="h-7 text-xs gap-1.5 shrink-0 rounded-lg bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-500"
                  >
                    <a.icon size={12} className="text-blue-500" /> {a.label}
                  </Button>
                ))}
              </div>

              {/* Prompt Composer */}
              <div className="p-4 sm:p-6 pt-3">
                <div className="max-w-4xl mx-auto">
                  <div className="relative flex items-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-inner">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          send(input);
                        }
                      }}
                      placeholder="Ask a question, request a diagram, or explain where you're stuck..."
                      rows={2}
                      className="flex-1 p-3.5 bg-transparent text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none resize-none placeholder:text-neutral-400"
                    />
                    <div className="pr-3 flex items-center gap-2">
                      <Button
                        onClick={() => send(input)}
                        disabled={loading || !input.trim()}
                        className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                      >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-neutral-400">
                    <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line</span>
                    <span className="hidden sm:inline">Powered by Bayesian Knowledge Tracing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right Cognitive Context Sidebar (Utilizing Screen Space) ─── */}
          {showContextPanel && (
            <aside className="w-80 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 overflow-y-auto hidden lg:flex flex-col shrink-0 gap-5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Cognitive Context
                  </span>
                  <Badge variant="blue" className="text-[10px]">Active Topic</Badge>
                </div>
                <Card className="border-neutral-200/90 dark:border-neutral-800 shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {CONTEXT.topic}
                      </div>
                      <div className="text-[11px] text-neutral-500">{CONTEXT.course}</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-neutral-500">Mastery Level</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{CONTEXT.mastery}%</span>
                      </div>
                      <Progress value={CONTEXT.mastery} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Prerequisite Graph (BKT)
                </div>
                <div className="space-y-2">
                  {CONTEXT.prerequisites.map(p => (
                    <div
                      key={p.name}
                      className="p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {p.name}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          p.mastery >= 80
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : p.mastery >= 60
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}>
                          {p.mastery}%
                        </span>
                      </div>
                      <Progress value={p.mastery} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Diagnosed Bottleneck
                </div>
                <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200 text-xs leading-relaxed">
                  <p className="font-medium mb-1">⚠️ Previous Drill Struggle:</p>
                  <p className="text-[11px] opacity-90">{CONTEXT.previousMistake}</p>
                </div>
              </div>

              <div className="mt-auto space-y-2 pt-2">
                <Link href="/dashboard/practice" className="block">
                  <Button variant="outline" className="w-full justify-between h-9 text-xs rounded-xl">
                    <span>Take Adaptive Drill</span>
                    <ArrowUpRight size={14} />
                  </Button>
                </Link>
                <Link href="/dashboard/revision" className="block">
                  <Button variant="outline" className="w-full justify-between h-9 text-xs rounded-xl">
                    <span>Review Spaced Flashcards</span>
                    <ArrowUpRight size={14} />
                  </Button>
                </Link>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
