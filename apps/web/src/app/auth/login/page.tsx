"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Sparkles, TrendingUp, Users, Zap, Shield, ArrowLeft } from "lucide-react";
import { Auth3 } from "@/components/ui/auth-03";
import ShimmerText from "@/components/ui/shimmer-text";
import TweetCard from "@/components/ui/tweet-card";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, quickFill, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>("student");

  const handleSignIn = async (email: string, password?: string) => {
    await login(email, password || "Demo@1234");
  };

  const handleSignUp = async (_name: string, email: string, password?: string, _role?: string) => {
    await login(email, password || "Demo@1234");
  };

  const quickFillDemo = async (role: "student" | "teacher" | "parent") => {
    await quickFill(role);
  };

  return (
    <div className="relative flex min-h-screen w-full bg-neutral-950 text-neutral-100 selection:bg-blue-500 selection:text-white">
      {/* ── Left Column: Brand Hero + Testimonial ── */}
      <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden border-r border-neutral-800/80 bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950/40 p-12 lg:flex xl:p-16">
        {/* Glow ambient background orbs */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[120px]" />

        {/* Top bar: Brand + Home link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">AdaptiveX</span>
              <span className="ml-1.5 rounded-md bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/30">
                AI
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>

        {/* Center: Headline & Tweet Card */}
        <div className="relative z-10 my-auto py-8 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-medium text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Smart India Hackathon 2024 Finalist Architecture</span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white xl:text-5xl leading-tight">
              Personalized Learning Path for Every Brain.
            </h1>

            <p className="mt-3 max-w-lg text-base text-neutral-400 leading-relaxed">
              Real-time cognitive mapping, sub-second gap diagnosis, and SM-2 spaced repetition — engineering maximum retention.
            </p>
          </div>

          {/* KokonutUI TweetCard Testimonial */}
          <div className="max-w-lg">
            <TweetCard
              authorName="Aarav Sharma"
              authorHandle="aarav_gate_cs"
              authorImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
              content={[
                "AdaptiveX AI caught my DBMS recursion gap in 10 mins 🎯",
                "1. Took adaptive diagnostic quiz",
                "2. Dynamic path auto-recalibrated",
                "3. Mastered B-Trees & Normalization in 3 days!",
              ]}
              isVerified={true}
              timestamp="Jan 18, 2025"
              reply={{
                authorName: "Dr. Priya Verma (Prof. IIT Delhi)",
                authorHandle: "priya_v_ai",
                authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
                content: "The teacher analytics dashboard flagged his misconception before class. Game changer for real-time intervention!",
                isVerified: true,
                timestamp: "Jan 18",
              }}
            />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 max-w-lg pt-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">94.8%</div>
              <div className="text-xs text-neutral-400 mt-0.5">Mastery Gain</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400">3.2×</div>
              <div className="text-xs text-neutral-400 mt-0.5">Faster Velocity</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="text-2xl font-bold text-emerald-400">0s</div>
              <div className="text-xs text-neutral-400 mt-0.5">Wasted Time</div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-neutral-500">
          <span>© 2025 AdaptiveX AI Platform</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-neutral-300">Privacy</Link>
            <Link href="#" className="hover:text-neutral-300">Terms</Link>
            <Link href="#" className="hover:text-neutral-300">Security</Link>
          </div>
        </div>
      </div>

      {/* ── Right Column: Auth Form ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-neutral-900/60 p-6 md:p-12">
        {/* Mobile Header */}
        <div className="mb-6 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">AdaptiveX AI</span>
        </div>

        {/* Watermelon Auth-03 Form */}
        <Auth3
          brandName="AdaptiveX AI"
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onForgotPassword={() => alert("Demo Mode: You can login with any credentials or use quick-demo buttons below.")}
          termsHref="#"
          privacyHref="#"
        />

        {/* ── Quick Demo Launcher for Judges ── */}
        <div className="mt-6 w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
              <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
              1-Click Demo Portals (Hackathon Judges)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800">
              LIVE
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => quickFillDemo("student")}
              type="button"
              className="flex flex-col items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900/90 p-2.5 text-center transition-all hover:border-blue-500 hover:bg-blue-950/30 hover:scale-[1.02] active:scale-95 group"
            >
              <span className="text-base group-hover:scale-110 transition-transform">🎓</span>
              <span className="text-xs font-semibold text-neutral-200 group-hover:text-blue-300">Student</span>
              <span className="text-[10px] text-neutral-500">Adaptive Path</span>
            </button>

            <button
              onClick={() => quickFillDemo("teacher")}
              type="button"
              className="flex flex-col items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900/90 p-2.5 text-center transition-all hover:border-emerald-500 hover:bg-emerald-950/30 hover:scale-[1.02] active:scale-95 group"
            >
              <span className="text-base group-hover:scale-110 transition-transform">📚</span>
              <span className="text-xs font-semibold text-neutral-200 group-hover:text-emerald-300">Teacher</span>
              <span className="text-[10px] text-neutral-500">Class Heatmap</span>
            </button>

            <button
              onClick={() => quickFillDemo("parent")}
              type="button"
              className="flex flex-col items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-900/90 p-2.5 text-center transition-all hover:border-purple-500 hover:bg-purple-950/30 hover:scale-[1.02] active:scale-95 group"
            >
              <span className="text-base group-hover:scale-110 transition-transform">👨‍👩‍👦</span>
              <span className="text-xs font-semibold text-neutral-200 group-hover:text-purple-300">Parent</span>
              <span className="text-[10px] text-neutral-500">AI Summary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
