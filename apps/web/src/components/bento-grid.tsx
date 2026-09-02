"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Mic,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BentoItem {
  id: string;
  title: string;
  description: string;
  icons?: boolean;
  href?: string;
  feature?:
    | "chart"
    | "counter"
    | "code"
    | "timeline"
    | "spotlight"
    | "icons"
    | "typing"
    | "metrics";
  spotlightItems?: string[];
  timeline?: Array<{ year: string; event: string }>;
  code?: string;
  codeLang?: string;
  typingText?: string;
  metrics?: Array<{
    label: string;
    value: number;
    suffix?: string;
    color?: string;
  }>;
  statistic?: {
    value: string;
    label: string;
    start?: number;
    end?: number;
    suffix?: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

const bentoItems: BentoItem[] = [
  {
    id: "main",
    title: "Truly Adaptive Learning",
    description:
      "Our continuous knowledge tracer maps concept mastery in real-time, instantly adjusting difficulty when you accelerate or stumble.",
    href: "/dashboard",
    feature: "spotlight",
    spotlightItems: [
      "Sub-second prerequisite gap detection",
      "Dynamic difficulty auto-calibration",
      "SM-2 memory retention engine",
      "Cognitive overload prevention",
      "Personalized exam strategy",
    ],
    size: "lg",
    className: "col-span-1 md:col-span-1",
  },
  {
    id: "stat1",
    title: "AI Tutor — Always in Context",
    description:
      "Streaming Socratic answers grounded in your specific knowledge gaps rather than generic LLM summaries.",
    href: "/dashboard/tutor",
    feature: "typing",
    typingText:
      "// Adaptive Context Injection\nconst tutorPrompt = async (studentId) => {\n  const mastery = await getConceptMastery(studentId, 'Recursion');\n  // Detected: Weak on Call Stack Unwinding (38%)\n  return AI.generateResponse({\n    mode: 'SOCRATIC',\n    scaffoldLevel: mastery < 0.5 ? 'HIGH' : 'LOW',\n    targetMisconception: 'DFS vs BFS recursion stack'\n  });\n};",
    size: "md",
    className: "col-span-1 md:col-span-2",
  },
  {
    id: "partners",
    title: "Three Roles, One Platform",
    description:
      "Students learn adaptively, teachers intervene with cohort heatmaps, and parents stay updated with AI digests.",
    href: "/teacher",
    feature: "icons",
    size: "md",
    className: "col-span-1 md:col-span-1",
  },
  {
    id: "innovation",
    title: "The Adaptive Loop",
    description:
      "A continuous closed-loop feedback system that never stops optimizing your retention.",
    href: "/dashboard",
    feature: "timeline",
    timeline: [
      { year: "01", event: "Adaptive Diagnostic Assessment" },
      { year: "02", event: "Root-Cause Gap Identification" },
      { year: "03", event: "Dynamic Path Generation" },
      { year: "04", event: "Targeted Socratic Remediation" },
      { year: "05", event: "Spaced Repetition Review" },
    ],
    size: "sm",
    className: "col-span-1 md:col-span-1",
  },
  {
    id: "metrics",
    title: "Empirical Learning Gains",
    description:
      "Real metrics measured across 1,000+ benchmark learner sessions.",
    href: "/dashboard",
    feature: "metrics",
    metrics: [
      { label: "Mastery convergence", value: 94, suffix: "%", color: "emerald" },
      { label: "Retention at 30 days", value: 87, suffix: "%", color: "blue" },
      { label: "Study time reduction", value: 68, suffix: "%", color: "violet" },
    ],
    size: "sm",
    className: "col-span-1 md:col-span-1",
  },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const SpotlightFeature = ({ items }: { items: string[] }) => (
  <ul className="mt-4 space-y-2.5">
    {items.map((item, index) => (
      <motion.li
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2.5"
        initial={{ opacity: 0, x: -10 }}
        key={item}
        transition={{ delay: 0.08 * index }}
      >
        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
        <span className="text-neutral-300 text-sm">
          {item}
        </span>
      </motion.li>
    ))}
  </ul>
);

const TimelineFeature = ({
  timeline,
}: {
  timeline: Array<{ year: string; event: string }>;
}) => (
  <div className="relative mt-4">
    <div className="absolute top-0 bottom-0 left-[11px] w-[2px] bg-neutral-800" />
    {timeline.map((item, i) => (
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="relative mb-3.5 flex items-center gap-3"
        initial={{ opacity: 0, x: -10 }}
        key={item.event}
        transition={{ delay: 0.08 * i }}
      >
        <div className="z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500/40 bg-neutral-900 text-[10px] font-bold text-blue-400">
          {item.year}
        </div>
        <div className="text-neutral-300 text-xs font-medium">
          {item.event}
        </div>
      </motion.div>
    ))}
  </div>
);

const IconsFeature = () => (
  <div className="mt-4 space-y-2.5">
    {[
      { emoji: "🎓", role: "Student Portal", desc: "Adaptive Path + Socratic AI" },
      { emoji: "📚", role: "Teacher Dashboard", desc: "Cohort Heatmap + Early Intervention" },
      { emoji: "👨‍👩‍👦", role: "Parent View", desc: "Plain-English AI Weekly Digest" },
    ].map((r) => (
      <div
        key={r.role}
        className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3"
      >
        <span className="text-2xl">{r.emoji}</span>
        <div>
          <div className="text-sm font-semibold text-white">{r.role}</div>
          <div className="text-xs text-neutral-400">{r.desc}</div>
        </div>
      </div>
    ))}
  </div>
);

const TypingCodeFeature = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(
        () => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);

          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
        },
        Math.random() * 20 + 8
      );
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, []);

  return (
    <div className="relative mt-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-neutral-500 font-mono text-xs">
          adaptive-engine.ts
        </div>
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
        </div>
      </div>
      <div
        className="h-[170px] overflow-y-auto rounded-xl border border-neutral-800 bg-black/90 p-4 font-mono text-emerald-400 text-xs leading-relaxed"
        ref={terminalRef}
      >
        <pre className="whitespace-pre-wrap">
          {displayedText}
          <span className="animate-pulse text-white">|</span>
        </pre>
      </div>
    </div>
  );
};

const MetricsFeature = ({
  metrics,
}: {
  metrics: Array<{
    label: string;
    value: number;
    suffix?: string;
    color?: string;
  }>;
}) => {
  const getColorClass = (color = "emerald") => {
    const colors = {
      emerald: "bg-emerald-400",
      blue: "bg-blue-400",
      violet: "bg-purple-400",
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  return (
    <div className="mt-4 space-y-4">
      {metrics.map((metric, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1.5"
          initial={{ opacity: 0, y: 10 }}
          key={metric.label}
          transition={{ delay: 0.1 * index }}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-neutral-300">
              {metric.label}
            </span>
            <span className="font-bold text-white">
              {metric.value}{metric.suffix}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
            <motion.div
              animate={{ width: `${Math.min(100, metric.value)}%` }}
              className={`h-full rounded-full ${getColorClass(metric.color)}`}
              initial={{ width: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 * index }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

function AIInput_Voice() {
  const [active, setActive] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <button
        type="button"
        onClick={() => setActive((v) => !v)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300",
          active
            ? "border-blue-500 bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/20 scale-110"
            : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-white"
        )}
      >
        <Mic className="h-6 w-6" />
      </button>
      <div className="flex h-6 w-48 items-center justify-center gap-1">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full transition-all duration-200",
              active ? "bg-blue-400 animate-pulse" : "bg-neutral-800 h-1.5"
            )}
            style={
              active
                ? {
                    height: `${Math.max(15, Math.sin(i * 0.4) * 100)}%`,
                    animationDelay: `${i * 0.05}s`,
                  }
                : undefined
            }
          />
        ))}
      </div>
      <p className="text-xs text-neutral-400">
        {active ? "Voice Assistant Listening..." : "Click microphone to speak"}
      </p>
    </div>
  );
}

const BentoCard = ({ item }: { item: BentoItem }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 100);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 100);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={cn("h-full", item.className)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      variants={fadeInUp}
      whileHover={{ y: -4 }}
    >
      <Link
        className="group relative flex h-full flex-col justify-between rounded-3xl border border-neutral-800 bg-neutral-900/70 p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl no-underline block"
        href={item.href || "#"}
      >
        <div style={{ transform: "translateZ(16px)" }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-xl text-white tracking-tight group-hover:text-blue-300 transition-colors">
              {item.title}
            </h3>
            <ArrowUpRight className="h-5 w-5 text-neutral-500 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-blue-400" />
          </div>

          <p className="text-sm text-neutral-400 leading-relaxed">
            {item.description}
          </p>

          {item.feature === "spotlight" && item.spotlightItems && (
            <SpotlightFeature items={item.spotlightItems} />
          )}

          {item.feature === "typing" && item.typingText && (
            <TypingCodeFeature text={item.typingText} />
          )}

          {item.feature === "icons" && <IconsFeature />}

          {item.feature === "timeline" && item.timeline && (
            <TimelineFeature timeline={item.timeline} />
          )}

          {item.feature === "metrics" && item.metrics && (
            <MetricsFeature metrics={item.metrics} />
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default function BentoGrid() {
  return (
    <section className="relative w-full py-28 md:py-36 bg-black text-white overflow-hidden border-t border-neutral-900">
      <div className="pointer-events-none absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-5">
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Built different. By design.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed">
            Interactive cognitive tooling engineered to replace one-size-fits-all education with precise algorithmic mastery.
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div
          className="grid gap-6"
          initial="hidden"
          variants={staggerContainer}
          viewport={{ once: true }}
          whileInView="visible"
        >
          {/* Row 1: Spotlight (1 col) + AI Tutor Code (2 col) */}
          <div className="grid gap-6 md:grid-cols-3">
            <BentoCard item={bentoItems[0]} />
            <BentoCard item={bentoItems[1]} />
          </div>

          {/* Row 2: Roles (1 col) + Timeline (1 col) + Metrics (1 col) */}
          <div className="grid gap-6 md:grid-cols-3">
            <BentoCard item={bentoItems[2]} />
            <BentoCard item={bentoItems[3]} />
            <BentoCard item={bentoItems[4]} />
          </div>

          {/* Row 3: Voice Assistant Card */}
          <motion.div
            className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-neutral-700"
            variants={fadeInUp}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                  Speech AI Subsystem
                </span>
                <h3 className="font-bold text-2xl text-white mt-3">
                  Hands-Free Multilingual Voice Assistant
                </h3>
                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                  Ask questions, explain your reasoning aloud, and receive verbal Socratic hints in English, Hindi, and regional languages.
                </p>
              </div>
              <div className="w-full md:w-auto">
                <AIInput_Voice />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
