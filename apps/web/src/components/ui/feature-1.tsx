"use client";

import {
  Lightbulb,
  ShieldCheck,
  Headphones,
  Database,
  ArrowLeftRight,
} from "lucide-react";

export default function Features1() {
  return (
    <section className="relative w-full py-28 md:py-36 bg-neutral-950 text-white overflow-hidden border-t border-neutral-900">
      {/* Background glow orb */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-5">
            Core Intelligence Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Continuous Adaptive Knowledge Engine
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed">
            Unlike static LMS platforms, AdaptiveX continuously recalibrates your cognitive model after every quiz attempt, mistake pattern, and review cycle.
          </p>
        </div>

        {/* 5-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Cognitive Gap Detection */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-8 backdrop-blur-md transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Cognitive Gap Detection
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Pinpoints exact root-cause misconceptions across prerequisite concepts before you fail high-stakes competitive exams.
              </p>
            </div>
            <div className="mt-8">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Sub-second diagnostic inference
              </span>
            </div>
          </div>

          {/* Card 2: Spaced Repetition */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-8 backdrop-blur-md transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Spaced Repetition Scheduler
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Integrated SM-2 algorithmic scheduling triggers micro-reviews at the exact mathematically predicted memory decay point.
              </p>
            </div>
            <div className="mt-8">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Retention increased 3.2x
              </span>
            </div>
          </div>

          {/* Card 3: Multi-Role Architecture */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-8 backdrop-blur-md transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Multi-Role Unified Ecosystem
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Seamless synchronization between Student learning journey, Teacher real-time cohort heatmaps, and Parent weekly SMS digests.
              </p>
            </div>
            <div className="mt-8">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Student · Teacher · Parent
              </span>
            </div>
          </div>

          {/* Card 4: Dynamic Path Generation (span 2 cols on desktop) */}
          <div className="md:col-span-2 rounded-3xl border border-neutral-800 bg-neutral-900/70 p-8 backdrop-blur-md transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <ArrowLeftRight className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Dynamic Remediation Path Auto-Calibration
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
                When a student accelerates through easy concepts, boilerplate content is bypassed. If a student stumbles, prerequisite branches auto-insert seamlessly.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Zero boilerplate curriculum
              </span>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
                Topological graph sorting
              </span>
            </div>
          </div>

          {/* Card 5: 24/7 Contextual Socratic Tutor */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-8 backdrop-blur-md transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-pink-500/5 hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Contextual Socratic AI Tutor
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Answers with progressive hints and cognitive scaffolding rather than dumping answers, building true reasoning fortitude.
              </p>
            </div>
            <div className="mt-8">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                Streaming Voice + Multilingual
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
