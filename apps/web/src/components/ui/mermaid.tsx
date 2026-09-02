"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { GitBranch } from "lucide-react";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const isDark = theme === "dark" || resolvedTheme === "dark";

    try {
      mermaid.initialize({
        startOnLoad: false,
        suppressErrorRendering: true,
        securityLevel: "loose",
        theme: isDark ? "dark" : "default",
        fontFamily: "var(--font-geist), system-ui, sans-serif",
        themeVariables: isDark
          ? {
              darkMode: true,
              background: "#1e293b",
              primaryColor: "#1e3a8a",
              primaryTextColor: "#f8fafc",
              primaryBorderColor: "#60a5fa",
              lineColor: "#93c5fd",
              secondaryColor: "#334155",
              tertiaryColor: "#0f172a",
              textColor: "#f8fafc",
              mainBkg: "#1e293b",
              nodeBorder: "#60a5fa",
              clusterBkg: "#0f172a",
              clusterBorder: "#334155",
              fontSize: "13px",
            }
          : {
              darkMode: false,
              background: "#f0f9ff",
              primaryColor: "#dbeafe",
              primaryTextColor: "#0f172a",
              primaryBorderColor: "#2563eb",
              lineColor: "#2563eb",
              secondaryColor: "#f1f5f9",
              tertiaryColor: "#ffffff",
              textColor: "#0f172a",
              mainBkg: "#eff6ff",
              nodeBorder: "#2563eb",
              clusterBkg: "#f8fafc",
              clusterBorder: "#cbd5e1",
              fontSize: "13px",
            },
      });
    } catch {
      // Ignore re-init
    }

    let isMounted = true;
    const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

    const renderChart = async () => {
      const cleanChart = chart.trim();
      if (!cleanChart) return;

      try {
        const { svg: renderedSvg } = await mermaid.render(uniqueId, cleanChart);
        if (isMounted) {
          setSvg(renderedSvg);
          setError(false);
        }
      } catch {
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (typeof document !== "undefined") {
          const rogueElements = document.querySelectorAll(
            `[id^="d${uniqueId}"], [id^="dmermaid"], .error-icon`
          );
          rogueElements.forEach(el => el.remove());
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
      if (typeof document !== "undefined") {
        const rogue = document.querySelectorAll(
          `[id^="dmermaid"], [id^="${uniqueId}"]`
        );
        rogue.forEach(el => el.remove());
      }
    };
  }, [chart, theme, resolvedTheme]);

  if (error || !svg) {
    return (
      <div className="bg-neutral-950 text-neutral-100 p-3.5 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-neutral-800 my-2">
        <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">
          <GitBranch size={12} /> Visual Diagram
        </div>
        <pre className="m-0 font-mono whitespace-pre leading-relaxed">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="my-3 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
          <GitBranch size={14} /> Interactive Visual Concept Diagram
        </div>
        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
          Auto-Synthesized
        </span>
      </div>

      <div
        className="flex justify-center items-center overflow-x-auto py-2 min-h-[120px] max-h-[460px] [&>svg]:max-w-full [&>svg]:h-auto [&_text]:fill-current text-neutral-900 dark:text-neutral-100"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
