"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Brain, Send, Mic, Image, Sparkles, BookOpen, RefreshCw, Target,
  Lightbulb, HelpCircle, FileText, ChevronRight, Loader2, AlertCircle,
  X, RotateCcw, Volume2, Copy, ThumbsUp, ThumbsDown, ExternalLink,
  LayoutDashboard, Zap, BarChart3, Award, Clock, MessageSquare, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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

const DEMO_RESPONSES: Record<string, string> = {
  default: `Great question! Let me explain this step by step.

**Understanding the Core Concept**

Think of it this way — when a function calls *itself* to solve a smaller version of the same problem, that's recursion.

Here's a simple example in Python:
\`\`\`python
def factorial(n):
    # Base case — stop condition
    if n <= 1:
        return 1
    # Recursive case — smaller problem
    return n * factorial(n - 1)

print(factorial(5))  # Output: 120
\`\`\`

**Trace it mentally:**
- factorial(5) = 5 × factorial(4)
- factorial(4) = 4 × factorial(3)
- factorial(3) = 3 × factorial(2)
- factorial(2) = 2 × factorial(1)
- factorial(1) = **1** ← base case!

> 💡 **Key insight**: Every recursive function needs a *base case* to stop. Without it, you get infinite recursion and a stack overflow.

**Why does this matter for trees?**

Tree traversal (inorder, preorder, postorder) is *naturally* recursive because each subtree is itself a tree. This is why mastering recursion unlocks trees, graphs, and dynamic programming.`,
};

const QUICK_ACTIONS = [
  { label: "Explain simply", icon: Lightbulb, prompt: "Explain this in the simplest possible way with an easy analogy" },
  { label: "Quiz me", icon: Target, prompt: "Ask me a practice question on this topic to test my understanding" },
  { label: "Give example", icon: BookOpen, prompt: "Give me a real-world example that makes this crystal clear" },
  { label: "Hint", icon: HelpCircle, prompt: "Give me a hint to solve this without giving away the answer" },
  { label: "Summarize", icon: FileText, prompt: "Summarize the key points in bullet form" },
  { label: "Compare concepts", icon: RefreshCw, prompt: "Compare this with a related concept I might confuse it with" },
];

const CONTEXT = {
  course: "Data Structures & Algorithms",
  topic: "Binary Trees & Recursion",
  mastery: 43,
  subtopic: "Tree Traversal",
  previousMistake: "Confused DFS with BFS traversal in the last quiz",
};

function TypingDots() {
  return (
    <div className="flex gap-1 items-center py-1">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce"
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
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-50 mt-3 mb-1.5 pb-1 border-b border-neutral-200 dark:border-neutral-800">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 mt-2.5 mb-1">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-2 mb-1">
              {children}
            </h4>
          ),
          h4: ({ children }) => (
            <h5 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-1.5 mb-0.5">
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="my-1.5 text-neutral-800 dark:text-neutral-200 leading-relaxed">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-neutral-950 dark:text-neutral-50">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="my-1.5 space-y-1 pl-4 list-disc marker:text-blue-500">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-1.5 space-y-1 pl-4 list-decimal marker:text-blue-500 font-medium">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-neutral-800 dark:text-neutral-200 pl-1">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-blue-500 pl-3 py-1.5 bg-blue-50/60 dark:bg-blue-950/20 text-blue-950 dark:text-blue-200 rounded-r-lg text-xs italic">
              {children}
            </blockquote>
          ),
          hr: () => <Separator className="my-3" />,
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-bold">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 font-bold text-neutral-900 dark:text-neutral-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 text-neutral-700 dark:text-neutral-300">
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
                <div className="bg-neutral-950 text-neutral-100 p-3.5 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-neutral-800 my-2">
                  {lang && (
                    <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                      {lang}
                    </div>
                  )}
                  <pre className="m-0 font-mono whitespace-pre">{codeString}</pre>
                </div>
              );
            }
            return (
              <code
                className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-1.5 py-0.5 rounded text-[11px] font-mono border border-neutral-200/80 dark:border-neutral-700 font-semibold"
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
      content: "Hello Aarav! I'm your AI Socratic Tutor. I see you're currently mastering **Binary Trees & Recursion** (43% mastery). What concept would you like to explore today?",
      timestamp: new Date(),
      sources: [
        { title: "Introduction to Algorithms (CLRS)", chapter: "Chapter 12 — Binary Search Trees" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
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
    <div className="flex h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* ─── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col shrink-0 h-full p-4 overflow-y-auto">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-neutral-950 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-950 flex items-center justify-center font-bold">
            <Brain size={16} />
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
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <LayoutDashboard size={15} /> Dashboard
          </Link>
          <Link
            href="/dashboard/path"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Target size={15} /> Learning Path
          </Link>
          <Link
            href="/dashboard/tutor"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50"
          >
            <Brain size={15} className="text-blue-600 dark:text-blue-400" /> AI Tutor
          </Link>
          <Link
            href="/dashboard/practice"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Zap size={15} /> Practice
          </Link>
          <Link
            href="/dashboard/revision"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <BarChart3 size={15} /> Analytics
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Award size={15} /> Achievements
          </Link>
        </div>

        <div className="mt-auto pt-4">
          <Separator className="mb-3" />
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
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

      {/* ─── Main Chat Panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Brain size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Socratic AI Tutor
              </div>
              <p className="text-[11px] text-neutral-500">Active model: z-ai/glm-5.3-free (TokenRouter)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="blue" className="text-[10px]">Context Aware</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessages(messages.slice(0, 1))}
              className="gap-1.5 h-8 text-xs"
            >
              <RotateCcw size={13} /> Reset Chat
            </Button>
          </div>
        </header>

        {/* Scrollable Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-neutral-50/50 dark:bg-neutral-950/40">
          <div className="max-w-4xl mx-auto space-y-4 pb-4">
            {messages.map(m => {
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                      <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className="max-w-3xl space-y-1.5 w-full">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm ${
                        isUser
                          ? "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 rounded-tr-none shadow-sm ml-auto max-w-xl"
                          : "bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-tl-none shadow-sm"
                      }`}
                    >
                      {m.isStreaming ? <TypingDots /> : <MessageContent content={m.content} />}
                    </div>

                    {!isUser && !m.isStreaming && (
                      <div className="flex items-center gap-2 px-1 text-[11px] text-neutral-400">
                        <button
                          onClick={() => copyToClipboard(m.content, m.id)}
                          className="hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1"
                        >
                          {copiedId === m.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          {copiedId === m.id ? "Copied" : "Copy"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} className="h-4" />
          </div>
        </div>

        {/* Fixed Bottom Controls */}
        <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10">
          {/* Quick Action Pills */}
          <div className="px-4 sm:px-6 py-2 flex gap-2 overflow-x-auto border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/20">
            {QUICK_ACTIONS.map(a => (
              <Button
                key={a.label}
                variant="outline"
                size="sm"
                onClick={() => send(a.prompt)}
                disabled={loading}
                className="h-7 text-xs gap-1.5 shrink-0 bg-white dark:bg-neutral-900"
              >
                <a.icon size={13} /> {a.label}
              </Button>
            ))}
          </div>

          {/* Prompt Composer */}
          <div className="p-4 sm:p-6 pt-3">
            <div className="flex gap-2 max-w-4xl mx-auto">
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
                placeholder="Ask a question, request a diagram, or explain what you're stuck on..."
                rows={2}
                className="flex-1 p-3 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
              <Button
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                className="h-auto px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
