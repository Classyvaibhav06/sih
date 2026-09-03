"use client";

/**
 * @author: @dorianbaffier
 * @description: Shape Hero adapted for AdaptiveX AI
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { motion } from "framer-motion";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import { Sparkles, ArrowRight, Play, Shield, Globe, Mic, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
  borderRadius = 16,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  borderRadius?: number;
}) {
  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        rotate,
      }}
      className={cn("absolute pointer-events-none", className)}
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        className="relative"
        style={{
          width,
          height,
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[1px]",
            "ring-1 ring-white/[0.05] dark:ring-white/[0.03]",
            "shadow-[0_2px_16px_-2px_rgba(255,255,255,0.04)]",
            "after:absolute after:inset-0",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_70%)]",
            "after:rounded-[inherit]"
          )}
          style={{ borderRadius }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function ShapeHero({
  title1 = "Learning That Adapts To",
  title2 = "Your Mind",
  subtitle = "An AI platform that models every student's cognitive gaps and dynamically decides what they should learn next — eliminating boilerplate education.",
}: {
  title1?: string;
  title2?: string;
  subtitle?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.3 + i * 0.18,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#030303] text-white pt-32 pb-24">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-rose-500/[0.06] blur-3xl pointer-events-none" />

      {/* Floating Shapes Canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Tall rectangle - top left */}
        <ElegantShape
          borderRadius={24}
          className="top-[-8%] left-[-10%]"
          delay={0.3}
          gradient="from-indigo-500/[0.30]"
          height={480}
          rotate={-8}
          width={280}
        />

        {/* Wide rectangle - bottom right */}
        <ElegantShape
          borderRadius={20}
          className="right-[-15%] bottom-[-5%]"
          delay={0.5}
          gradient="from-rose-500/[0.30]"
          height={200}
          rotate={15}
          width={580}
        />

        {/* Square - middle left */}
        <ElegantShape
          borderRadius={32}
          className="top-[35%] left-[-3%]"
          delay={0.4}
          gradient="from-violet-500/[0.30]"
          height={280}
          rotate={24}
          width={280}
        />

        {/* Small rectangle - top right */}
        <ElegantShape
          borderRadius={12}
          className="top-[8%] right-[8%]"
          delay={0.6}
          gradient="from-amber-500/[0.30]"
          height={110}
          rotate={-20}
          width={240}
        />

        {/* Medium rectangle - center right */}
        <ElegantShape
          borderRadius={16}
          className="top-[45%] right-[-8%]"
          delay={0.7}
          gradient="from-emerald-500/[0.30]"
          height={140}
          rotate={35}
          width={380}
        />

        {/* Small square - bottom left */}
        <ElegantShape
          borderRadius={28}
          className="bottom-[12%] left-[15%]"
          delay={0.2}
          gradient="from-blue-500/[0.30]"
          height={180}
          rotate={-25}
          width={180}
        />

        {/* Tiny rectangle - top center */}
        <ElegantShape
          borderRadius={10}
          className="top-[12%] left-[38%]"
          delay={0.8}
          gradient="from-purple-500/[0.30]"
          height={75}
          rotate={45}
          width={140}
        />

        {/* Wide rectangle - middle */}
        <ElegantShape
          borderRadius={18}
          className="top-[62%] left-[22%]"
          delay={0.9}
          gradient="from-teal-500/[0.30]"
          height={110}
          rotate={-12}
          width={420}
        />
      </div>

      {/* Main Content Area */}
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <motion.div
            animate="visible"
            custom={0}
            initial="hidden"
            variants={fadeUpVariants}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              <span>Smart India Hackathon 2024 Adaptive Architecture</span>
            </div>
          </motion.div>

          {/* Heading with KokonutUI Shimmer Animation */}
          <motion.div
            animate="visible"
            custom={1}
            initial="hidden"
            variants={fadeUpVariants}
          >
            <h1 className="mb-6 font-bold text-5xl tracking-tight sm:text-7xl md:mb-8 md:text-8xl lg:text-9xl leading-[1.05]">
              <motion.span
                animate={{
                  backgroundPosition: ["200% center", "-200% center"],
                }}
                className="inline-block bg-[length:200%_100%] bg-gradient-to-r from-white via-neutral-400 to-white bg-clip-text text-transparent"
                transition={{
                  duration: 3.5,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                {title1}
              </motion.span>
              <br />
              <motion.span
                animate={{
                  backgroundPosition: ["200% center", "-200% center"],
                }}
                className={cn(
                  "inline-block bg-[length:200%_100%] bg-gradient-to-r from-indigo-300 via-rose-200 to-indigo-300 bg-clip-text text-transparent drop-shadow-md py-2",
                  pacifico.className
                )}
                transition={{
                  duration: 4,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                {title2}
              </motion.span>
            </h1>
          </motion.div>



          {/* Subtitle */}
          <motion.div
            animate="visible"
            custom={2}
            initial="hidden"
            variants={fadeUpVariants}
          >
            <p className="mx-auto mb-8 max-w-2xl px-4 font-light text-base sm:text-lg md:text-xl text-white/60 leading-relaxed tracking-wide">
              {subtitle}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            animate="visible"
            custom={3}
            initial="hidden"
            variants={fadeUpVariants}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 px-8 py-4 text-sm font-bold text-neutral-200 transition-all hover:border-neutral-700 backdrop-blur-sm"
            >
              <Play className="h-4 w-4 text-blue-400 fill-blue-400/20" />
              <span>View Live Demo</span>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            animate="visible"
            custom={4}
            initial="hidden"
            variants={fadeUpVariants}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-medium text-neutral-400"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-400" /> Privacy-First Architecture
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" /> Multilingual Support
            </div>
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-purple-400" /> Socratic Voice AI
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" /> SM-2 Spaced Repetition
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle vignette top & bottom */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80" />

      {/* Live Dashboard Preview Mock Frame */}
      <motion.div
        animate="visible"
        custom={5}
        initial="hidden"
        variants={fadeUpVariants}
        className="relative z-10 mt-16 w-full max-w-5xl mx-auto px-4"
      >
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/90 p-2 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">
          <div className="overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/90">
            {/* Top Window Bar */}
            <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 py-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-1 text-xs text-neutral-400 font-mono">
                adaptivex.ai/dashboard
              </div>
              <div className="w-12" />
            </div>

            {/* Inner Dashboard View */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
                <div className="text-xs text-neutral-500 font-medium">STREAK</div>
                <div className="text-2xl font-black text-amber-400 mt-1">14 days</div>
                <div className="text-[11px] text-emerald-400 mt-0.5">🔥 Top 5% cohort</div>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
                <div className="text-xs text-neutral-500 font-medium">XP EARNED</div>
                <div className="text-2xl font-black text-purple-400 mt-1">3,240 XP</div>
                <div className="text-[11px] text-purple-300 mt-0.5">Level 12 Scholar</div>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
                <div className="text-xs text-neutral-500 font-medium">AVG MASTERY</div>
                <div className="text-2xl font-black text-blue-400 mt-1">94.8%</div>
                <div className="text-[11px] text-blue-300 mt-0.5">+14% this week</div>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
                <div className="text-xs text-neutral-500 font-medium">DUE REVISIONS</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">4 Topics</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">SM-2 Scheduled</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
