import { Star, Target, Zap, Award } from "lucide-react";

const stats = [
  {
    icon: Target,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    label: "Knowledge Accuracy",
    sublabel: "Pre & Post Diagnostic",
    metric: "94.8",
    metricSuffix: "%",
    subtext: "Mastery Convergence Rate",
    description:
      "Average student concept mastery score improves from 42% to 94.8% after completing AI-curated remediation paths.",
    starColor: "text-blue-400",
    ratingCount: 5,
  },
  {
    icon: Zap,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    label: "Learning Velocity",
    sublabel: "Time to Master",
    metric: "3.2",
    metricSuffix: "x",
    subtext: "Faster Concept Retention",
    description:
      "Spaced repetition and dynamic cognitive load optimization eliminate redundant study hours, accelerating exam readiness.",
    starColor: "text-amber-400",
    ratingCount: 5,
  },
  {
    icon: Award,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    label: "Exam Confidence",
    sublabel: "Cohort Success Rate",
    metric: "98.2",
    metricSuffix: "%",
    subtext: "SIH Benchmark Control",
    description:
      "Tested across rigorous STEM curricula (GATE, JEE, CBSE Class 12, Data Structures) with proven retention across 1,000+ benchmark trials.",
    starColor: "text-emerald-400",
    ratingCount: 5,
  },
];

export default function Stats1() {
  return (
    <section className="relative w-full py-28 md:py-36 bg-neutral-950 text-white overflow-hidden border-t border-neutral-900">
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-emerald-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-5">
            Proven Empirical Results
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Adaptive Impact by the Numbers
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed">
            Quantifiable improvements measured across knowledge retention, learning velocity, and diagnostic remediation cycles.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-neutral-700 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center gap-3 mb-8">
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${stat.iconBg} ${stat.iconColor}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {stat.label}
                    </div>
                    <div className="text-[11px] font-medium tracking-wider uppercase text-neutral-500">
                      {stat.sublabel}
                    </div>
                  </div>
                </div>

                {/* Big Metric Number */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                    {stat.metric}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-neutral-400">
                    {stat.metricSuffix}
                  </span>
                </div>

                {/* Subtitle & Description */}
                <h4 className="text-sm font-bold text-neutral-200 mb-2">
                  {stat.subtext}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {stat.description}
                </p>
              </div>

              {/* Star Rating Footer */}
              <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between">
                <div className="flex gap-1">
                  {Array.from({ length: stat.ratingCount }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 fill-current ${stat.starColor}`} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-400">
                  5.0 Benchmark Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
