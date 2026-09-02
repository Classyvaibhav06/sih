"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { GitBranch, Eye, AlertCircle } from "lucide-react";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const isDark = theme === "dark" || resolvedTheme === "dark";

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "neutral",
      securityLevel: "loose",
      fontFamily: "var(--font-geist), system-ui, sans-serif",
      themeVariables: isDark
        ? {
            darkMode: true,
            background: "#171717",
            primaryColor: "#3b82f6",
            primaryTextColor: "#f8fafc",
            primaryBorderColor: "#60a5fa",
            lineColor: "#94a3b8",
            secondaryColor: "#1e293b",
            tertiaryColor: "#0f172a",
          }
        : {
            darkMode: false,
            background: "#ffffff",
            primaryColor: "#2563eb",
            primaryTextColor: "#0f172a",
            primaryBorderColor: "#3b82f6",
            lineColor: "#64748b",
            secondaryColor: "#f1f5f9",
            tertiaryColor: "#f8fafc",
          },
    });

    let isMounted = true;
    const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

    const renderChart = async () => {
      try {
        const cleanChart = chart.trim();
        if (!cleanChart) return;
        const { svg: renderedSvg } = await mermaid.render(uniqueId, cleanChart);
        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to render visual diagram");
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, theme, resolvedTheme]);

  if (error) {
    return (
      <div className="bg-neutral-950 text-neutral-100 p-3.5 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-neutral-800 my-2">
        <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">
          <GitBranch size={12} /> Visual Diagram (Raw Source)
        </div>
        <pre className="m-0 font-mono whitespace-pre">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="my-3 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-4 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
          <GitBranch size={14} /> Interactive Visual Concept Diagram
        </div>
        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
          Auto-Synthesized
        </span>
      </div>

      <div
        ref={containerRef}
        className="flex justify-center items-center overflow-x-auto py-2 [&>svg]:max-w-full [&>svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
