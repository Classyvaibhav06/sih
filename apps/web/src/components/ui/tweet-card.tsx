"use client";

import { VerifiedIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @author: @dorianbaffier
 * @description: Tweet Card
 * @version: 1.0.0
 * @date: 2025-10-01
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

type ReplyProps = {
  authorName: string;
  authorHandle: string;
  authorImage: string;
  content: string;
  isVerified?: boolean;
  timestamp: string;
};

type TweetCardProps = {
  authorName?: string;
  authorHandle?: string;
  authorImage?: string;
  content?: string[];
  isVerified?: boolean;
  timestamp?: string;
  href?: string;
  reply?: ReplyProps;
  className?: string;
};

export default function TweetCard({
  authorName = "Aarav Sharma",
  authorHandle = "aarav_gate_cs",
  authorImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  content = [
    "AdaptiveX AI's knowledge-gap detection caught my DBMS recursion blindspot in 10 mins 🎯",
    "1. Took adaptive diagnostic quiz",
    "2. Auto-generated spaced-repetition path",
    "3. Mastered B-Trees & Normalization in 3 days!",
  ],
  isVerified = true,
  timestamp = "Jan 18, 2025",
  href = "#",
  reply = {
    authorName: "Dr. Priya Verma (Prof. IIT Delhi)",
    authorHandle: "priya_v_ai",
    authorImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    content: "The teacher analytics dashboard flagged his misconception before class. Game changer for real-time intervention!",
    isVerified: true,
    timestamp: "Jan 18",
  },
  className,
}: TweetCardProps) {
  return (
    <Link href={href} target="_blank" className="block text-left no-underline">
      <div
        className={cn(
          "relative isolate w-full min-w-[320px] max-w-xl overflow-hidden rounded-2xl p-1.5 md:min-w-[480px]",
          "bg-white/5 dark:bg-black/90",
          "bg-gradient-to-br from-black/5 to-black/[0.02] dark:from-white/5 dark:to-white/[0.02]",
          "backdrop-blur-xl backdrop-saturate-[180%]",
          "border border-black/10 dark:border-white/10",
          "shadow-[0_8px_16px_rgb(0_0_0_/_0.15)] dark:shadow-[0_8px_16px_rgb(0_0_0_/_0.25)]",
          "translate-z-0 will-change-transform transition-all duration-300 hover:scale-[1.01] hover:border-blue-500/40",
          className
        )}
      >
        <div
          className={cn(
            "relative w-full rounded-xl p-5",
            "bg-gradient-to-br from-black/[0.05] to-transparent dark:from-white/[0.08] dark:to-transparent",
            "backdrop-blur-md backdrop-saturate-150",
            "border border-black/[0.05] dark:border-white/[0.08]",
            "text-neutral-900 dark:text-white",
            "shadow-sm",
            "translate-z-0 will-change-transform",
            "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/[0.02] before:to-black/[0.01] before:opacity-0 before:transition-opacity dark:before:from-white/[0.03] dark:before:to-white/[0.01]",
            "hover:before:opacity-100"
          )}
        >
          <div className="flex gap-3">
            <div className="shrink-0">
              <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-neutral-300 dark:ring-neutral-700">
                <img
                  alt={authorName}
                  className="h-full w-full object-cover"
                  src={authorImage}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-neutral-900 hover:underline dark:text-white/90">
                      {authorName}
                    </span>
                    {isVerified && (
                      <VerifiedIcon className="h-4 w-4 text-blue-500 fill-blue-500/20" />
                    )}
                  </div>
                  <span className="text-neutral-500 text-xs dark:text-white/60">
                    @{authorHandle}
                  </span>
                </div>
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-lg p-1 text-neutral-500 hover:bg-neutral-200/50 dark:text-white/80 dark:hover:bg-white/10 transition-colors"
                  type="button"
                  aria-label="X logo"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 1200 1227"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            {content.map((item, index) => (
              <p
                className="text-sm text-neutral-800 leading-relaxed dark:text-neutral-200"
                key={index}
              >
                {item}
              </p>
            ))}
            <span className="mt-2 block text-neutral-400 text-xs dark:text-neutral-500">
              {timestamp}
            </span>
          </div>

          {reply && (
            <div className="mt-3.5 border-neutral-200/80 border-t pt-3.5 dark:border-white/10">
              <div className="flex gap-2.5">
                <div className="shrink-0">
                  <div className="h-8 w-8 overflow-hidden rounded-full ring-1 ring-neutral-300 dark:ring-neutral-700">
                    <img
                      alt={reply.authorName}
                      className="h-full w-full object-cover"
                      src={reply.authorImage}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-xs text-neutral-900 dark:text-white/90">
                      {reply.authorName}
                    </span>
                    {reply.isVerified && (
                      <VerifiedIcon className="h-3 w-3 text-blue-500 fill-blue-500/20" />
                    )}
                    <span className="text-neutral-500 text-[11px] dark:text-white/60">
                      @{reply.authorHandle}
                    </span>
                    <span className="text-neutral-400 text-[11px]">·</span>
                    <span className="text-neutral-400 text-[11px]">
                      {reply.timestamp}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-700 leading-relaxed dark:text-neutral-300">
                    {reply.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
