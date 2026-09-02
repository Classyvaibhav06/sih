"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── COLOR TOKENS ─────────────────────────────────────────────────────────
   Style reference: AGNOE-style clean white hero with blue accent
   - White/off-white canvas
   - Black primary text
   - Blue accent: #1a56db
   - Gray subtitles: #6b7280
   - Black CTA pills
   - Illustrated/video scene fills the bottom of hero
────────────────────────────────────────────────────────────────────────── */

const C = {
  white: "#ffffff",
  canvas: "#f9fafb",
  obsidian: "#111827",
  ink: "#1f2937",
  gray: "#6b7280",
  lightGray: "#e5e7eb",
  blue: "#1a56db",
  blueLight: "#3b82f6",
  border: "#e5e7eb",
};

// ─── Navbar ───────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        background: scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all 200ms ease",
      }}
    >
      {/* Brand */}
      <Link
        href="/"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 16,
          fontWeight: 700,
          color: C.blue,
          textDecoration: "none",
          letterSpacing: "-0.02em",
        }}
      >
        AdaptiveX
      </Link>

      {/* Center links */}
      <div
        style={{
          display: "flex",
          gap: 32,
          alignItems: "center",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {["Features", "Benefits", "Pricing", "About"].map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: C.ink,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.blue)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.ink)}
          >
            {l}
          </a>
        ))}
      </div>

      {/* Right CTAs */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link
          href="/auth/login"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: C.ink,
            textDecoration: "none",
            padding: "0 4px",
          }}
        >
          Log In
        </Link>
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: 38,
            padding: "0 20px",
            background: C.obsidian,
            color: C.white,
            borderRadius: 9999,
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

// ─── Hero Settings Interface & Presets ────────────────────────────────────
export interface HeroSettings {
  align: "left" | "center" | "right";
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number; // em
  lineHeight: number;
  line1Text: string;
  line1Color: string;
  line2Text: string;
  line2Color: string;
  line2FontFamily: string;
  line2Weight: number;
  subtitleText: string;
  subtitleSize: number;
  subtitleColor: string;
  badgeText: string;
  showBadge: boolean;
  ctaText: string;
  ctaBg: string;
  ctaColor: string;
  overlayOpacity: number; // 0-100
  verticalOffset: number; // -100 to +100 px
  videoBrightness: number; // 50-150%
  videoBlur: number; // 0-20px
}

const defaultHeroSettings: HeroSettings = {
  align: "center",
  fontFamily: "Plus Jakarta Sans",
  fontSize: 79,
  fontWeight: 700,
  letterSpacing: -0.03,
  lineHeight: 1.1,
  line1Text: "Transform How You",
  line1Color: "#111827",
  line2Text: "Learn & Grow",
  line2Color: "#1a56db",
  line2FontFamily: "Plus Jakarta Sans",
  line2Weight: 700,
  subtitleText: "AI that maps your knowledge gaps, builds a personalized path, and adapts every session — all in one place.",
  subtitleSize: 17,
  subtitleColor: "#6b7280",
  badgeText: "Trusted by 500+ students nationwide",
  showBadge: true,
  ctaText: "Try It Free for 30 Days",
  ctaBg: "#111827",
  ctaColor: "#ffffff",
  overlayOpacity: 75,
  verticalOffset: 0,
  videoBrightness: 100,
  videoBlur: 0,
};

const FONT_OPTIONS = [
  { label: "Inter (Clean & Modern)", value: "Inter" },
  { label: "Poppins (Rounded & Bold)", value: "Poppins" },
  { label: "Outfit (Geometric & Tech)", value: "Outfit" },
  { label: "Plus Jakarta Sans (Crisp UI)", value: "Plus Jakarta Sans" },
  { label: "Pacifico (Playful Script)", value: "Pacifico" },
  { label: "Space Grotesk (Tech Editorial)", value: "Space Grotesk" },
  { label: "Playfair Display (Luxury Serif)", value: "Playfair Display" },
  { label: "JetBrains Mono (Developer Code)", value: "JetBrains Mono" },
  { label: "Montserrat (Classic Headline)", value: "Montserrat" },
  { label: "Syne (Avant-Garde Display)", value: "Syne" },
];

const PRESETS: Record<string, Partial<HeroSettings>> = {
  "AGNOE Clean": {
    align: "center",
    fontFamily: "Inter",
    line2FontFamily: "Inter",
    fontSize: 64,
    fontWeight: 700,
    line2Weight: 700,
    letterSpacing: -0.03,
    lineHeight: 1.1,
    line1Text: "Transform How You",
    line1Color: "#111827",
    line2Text: "Learn & Grow",
    line2Color: "#1a56db",
    subtitleSize: 17,
    subtitleColor: "#6b7280",
    overlayOpacity: 75,
    ctaBg: "#111827",
    ctaColor: "#ffffff",
  },
  "Pacifico Script": {
    align: "center",
    fontFamily: "Outfit",
    line2FontFamily: "Pacifico",
    fontSize: 60,
    fontWeight: 800,
    line2Weight: 400,
    letterSpacing: -0.02,
    lineHeight: 1.15,
    line1Text: "Master Your Studies with",
    line1Color: "#111827",
    line2Text: "Adaptive AI",
    line2Color: "#8b5cf6",
    subtitleSize: 18,
    subtitleColor: "#4b5563",
    overlayOpacity: 80,
    ctaBg: "#8b5cf6",
    ctaColor: "#ffffff",
  },
  "Vercel Editorial": {
    align: "center",
    fontFamily: "Inter",
    line2FontFamily: "Inter",
    fontSize: 72,
    fontWeight: 500,
    line2Weight: 500,
    letterSpacing: -0.055,
    lineHeight: 1.0,
    line1Text: "Learning that adapts",
    line1Color: "#000000",
    line2Text: "to your mind",
    line2Color: "#000000",
    subtitleSize: 16,
    subtitleColor: "#4d4d4d",
    overlayOpacity: 85,
    ctaBg: "#000000",
    ctaColor: "#ffffff",
  },
  "Luxury Serif": {
    align: "center",
    fontFamily: "Playfair Display",
    line2FontFamily: "Playfair Display",
    fontSize: 68,
    fontWeight: 700,
    line2Weight: 700,
    letterSpacing: -0.01,
    lineHeight: 1.1,
    line1Text: "Intelligent Education,",
    line1Color: "#0f172a",
    line2Text: "Tailored For You",
    line2Color: "#2563eb",
    subtitleSize: 17,
    subtitleColor: "#64748b",
    overlayOpacity: 75,
    ctaBg: "#0f172a",
    ctaColor: "#ffffff",
  },
  "Brutalist Tech": {
    align: "left",
    fontFamily: "Space Grotesk",
    line2FontFamily: "JetBrains Mono",
    fontSize: 62,
    fontWeight: 700,
    line2Weight: 600,
    letterSpacing: -0.04,
    lineHeight: 1.05,
    line1Text: "AUTONOMOUS LEARNING",
    line1Color: "#111827",
    line2Text: "> INITIALIZE_NOW",
    line2Color: "#059669",
    subtitleSize: 16,
    subtitleColor: "#374151",
    overlayOpacity: 80,
    ctaBg: "#059669",
    ctaColor: "#ffffff",
  },
};

// ─── Hero Component ───────────────────────────────────────────────────────
function Hero({ s }: { s: HeroSettings }) {
  const alignStyle =
    s.align === "left"
      ? { alignItems: "flex-start", textAlign: "left" as const }
      : s.align === "right"
      ? { alignItems: "flex-end", textAlign: "right" as const }
      : { alignItems: "center", textAlign: "center" as const };

  return (
    <section
      style={{
        position: "relative",
        background: C.white,
        height: "100vh",
        minHeight: 650,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 40px",
      }}
    >
      {/* ── Video Background with Dynamic Filters ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            display: "block",
            filter: `brightness(${s.videoBrightness}%) blur(${s.videoBlur}px)`,
            transform: s.videoBlur > 0 ? "scale(1.05)" : "none",
            transition: "filter 200ms ease",
          }}
        >
          <source src="/bck.mp4" type="video/mp4" />
        </video>

        {/* Dynamic radial gradient wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center 40%, rgba(255,255,255,${
              (s.overlayOpacity / 100) * 0.95
            }) 0%, rgba(255,255,255,${
              (s.overlayOpacity / 100) * 0.75
            }) 45%, rgba(255,255,255,${(s.overlayOpacity / 100) * 0.15}) 85%)`,
            pointerEvents: "none",
            transition: "background 200ms ease",
          }}
        />

        {/* Bottom fade into canvas */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background: "linear-gradient(to bottom, transparent, #ffffff)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── Configurable Text Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          maxWidth: s.align === "center" ? 780 : 860,
          width: "100%",
          margin: "0 auto",
          transform: `translateY(${s.verticalOffset}px)`,
          transition: "transform 150ms ease",
          ...alignStyle,
        }}
      >
        {/* Social proof badge */}
        {s.showBadge && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: `1px solid ${C.border}`,
              borderRadius: 9999,
              padding: "6px 16px 6px 8px",
              marginBottom: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex" }}>
              {["#3b82f6", "#8b5cf6", "#f59e0b"].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: c,
                    border: "2px solid white",
                    marginLeft: i === 0 ? 0 : -8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {["A", "R", "P"][i]}
                </div>
              ))}
            </div>
            <span
              style={{
                fontFamily: `'${s.fontFamily}', sans-serif`,
                fontSize: 13,
                fontWeight: 500,
                color: C.ink,
              }}
            >
              {s.badgeText}
            </span>
          </div>
        )}

        {/* Headline line 1 */}
        {s.line1Text && (
          <h1
            style={{
              fontFamily: `'${s.fontFamily}', sans-serif`,
              fontSize: `clamp(${Math.round(s.fontSize * 0.65)}px, 6vw, ${s.fontSize}px)`,
              fontWeight: s.fontWeight,
              lineHeight: s.lineHeight,
              letterSpacing: `${s.letterSpacing}em`,
              color: s.line1Color,
              margin: 0,
              transition: "all 150ms ease",
            }}
          >
            {s.line1Text}
          </h1>
        )}

        {/* Headline line 2 */}
        {s.line2Text && (
          <h1
            style={{
              fontFamily: `'${s.line2FontFamily || s.fontFamily}', sans-serif`,
              fontSize: `clamp(${Math.round(s.fontSize * 0.65)}px, 6vw, ${s.fontSize}px)`,
              fontWeight: s.line2Weight || s.fontWeight,
              lineHeight: s.lineHeight,
              letterSpacing: `${s.letterSpacing}em`,
              color: s.line2Color,
              margin: "0 0 20px",
              transition: "all 150ms ease",
            }}
          >
            {s.line2Text}
          </h1>
        )}

        {/* Subtitle */}
        {s.subtitleText && (
          <p
            style={{
              fontFamily: `'${s.fontFamily}', sans-serif`,
              fontSize: `${s.subtitleSize}px`,
              fontWeight: 400,
              color: s.subtitleColor,
              lineHeight: 1.6,
              maxWidth: 540,
              margin: s.align === "center" ? "0 auto 32px" : "0 0 32px",
              transition: "all 150ms ease",
            }}
          >
            {s.subtitleText}
          </p>
        )}

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 52,
              padding: "0 36px",
              background: s.ctaBg,
              color: s.ctaColor,
              borderRadius: 9999,
              fontFamily: `'${s.fontFamily}', sans-serif`,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.15)";
            }}
          >
            {s.ctaText}
          </Link>
        </div>

        <p
          style={{
            fontFamily: `'${s.fontFamily}', sans-serif`,
            fontSize: 13,
            color: s.subtitleColor,
            opacity: 0.8,
            marginTop: 14,
          }}
        >
          No credit card required · Free forever plan available
        </p>
      </div>
    </section>
  );
}

// ─── Floating Controls Studio Widget ───────────────────────────────────────
function HeroControls({
  s,
  setS,
}: {
  s: HeroSettings;
  setS: React.Dispatch<React.SetStateAction<HeroSettings>>;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"typography" | "content" | "scene" | "presets">("typography");
  const [copied, setCopied] = useState(false);

  const update = (key: keyof HeroSettings, val: any) => {
    setS((prev) => ({ ...prev, [key]: val }));
  };

  const applyPreset = (name: string) => {
    const preset = PRESETS[name];
    if (preset) {
      setS((prev) => ({ ...prev, ...preset }));
    }
  };

  const copyCSS = () => {
    const cssCode = `/* Hero Styling Configuration */
.hero-title-1 {
  font-family: '${s.fontFamily}', sans-serif;
  font-size: ${s.fontSize}px;
  font-weight: ${s.fontWeight};
  letter-spacing: ${s.letterSpacing}em;
  line-height: ${s.lineHeight};
  color: ${s.line1Color};
  text-align: ${s.align};
}
.hero-title-2 {
  font-family: '${s.line2FontFamily || s.fontFamily}', sans-serif;
  font-size: ${s.fontSize}px;
  font-weight: ${s.line2Weight || s.fontWeight};
  color: ${s.line2Color};
}
.hero-subtitle {
  font-size: ${s.subtitleSize}px;
  color: ${s.subtitleColor};
}
.hero-cta {
  background: ${s.ctaBg};
  color: ${s.ctaColor};
}`;
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 44,
          padding: "0 18px",
          background: "#111827",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 9999,
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          backdropFilter: "blur(12px)",
          transition: "transform 150ms ease, box-shadow 150ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <span style={{ fontSize: 16 }}>{open ? "✕" : "🎨"}</span>
        <span>{open ? "Close Controls" : "Hero Customizer"}</span>
      </button>

      {/* Floating Controls Drawer */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 24,
            zIndex: 9998,
            width: 380,
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 20,
            boxShadow: "0 20px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)",
            fontFamily: "'Inter', sans-serif",
            color: "#111827",
            padding: 20,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>🎨 Hero Studio</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Live Visual Adjuster</div>
            </div>
            <button
              onClick={() => setS(defaultHeroSettings)}
              style={{
                fontSize: 11,
                color: "#64748b",
                background: "#f1f5f9",
                border: "none",
                borderRadius: 6,
                padding: "4px 8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Reset
            </button>
          </div>

          {/* Tab buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 4,
              background: "#f1f5f9",
              padding: 3,
              borderRadius: 10,
              marginBottom: 16,
            }}
          >
            {(
              [
                { id: "typography", label: "Type" },
                { id: "content", label: "Text" },
                { id: "scene", label: "Scene" },
                { id: "presets", label: "Presets" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "6px 0",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  borderRadius: 7,
                  cursor: "pointer",
                  background: tab === t.id ? "#ffffff" : "transparent",
                  color: tab === t.id ? "#111827" : "#64748b",
                  boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "all 150ms ease",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB 1: Typography ── */}
          {tab === "typography" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Alignment */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                  Text Alignment
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => update("align", a)}
                      style={{
                        padding: "7px 0",
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "capitalize",
                        borderRadius: 8,
                        border: s.align === a ? "2px solid #1a56db" : "1px solid #e2e8f0",
                        background: s.align === a ? "#eff6ff" : "#ffffff",
                        color: s.align === a ? "#1a56db" : "#475569",
                        cursor: "pointer",
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family Line 1 */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                  Primary Font (Line 1 & Body)
                </label>
                <select
                  value={s.fontFamily}
                  onChange={(e) => update("fontFamily", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 13,
                    background: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Family Line 2 */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                  Accent Font (Line 2)
                </label>
                <select
                  value={s.line2FontFamily}
                  onChange={(e) => update("line2FontFamily", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 13,
                    background: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Headline Size Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Headline Size</label>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{s.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={36}
                  max={96}
                  value={s.fontSize}
                  onChange={(e) => update("fontSize", Number(e.target.value))}
                  style={{ width: "100%", cursor: "pointer" }}
                />
              </div>

              {/* Font Weight */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                  Headline Weight (Line 1)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
                  {[400, 500, 600, 700, 800].map((w) => (
                    <button
                      key={w}
                      onClick={() => update("fontWeight", w)}
                      style={{
                        padding: "6px 0",
                        fontSize: 11,
                        fontWeight: w,
                        borderRadius: 6,
                        border: s.fontWeight === w ? "2px solid #1a56db" : "1px solid #e2e8f0",
                        background: s.fontWeight === w ? "#eff6ff" : "#ffffff",
                        color: s.fontWeight === w ? "#1a56db" : "#475569",
                        cursor: "pointer",
                      }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Letter Spacing */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Letter Spacing</label>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{s.letterSpacing}em</span>
                </div>
                <input
                  type="range"
                  min={-0.08}
                  max={0.08}
                  step={0.005}
                  value={s.letterSpacing}
                  onChange={(e) => update("letterSpacing", Number(e.target.value))}
                  style={{ width: "100%", cursor: "pointer" }}
                />
              </div>

              {/* Line Height */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Line Height</label>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{s.lineHeight}</span>
                </div>
                <input
                  type="range"
                  min={0.9}
                  max={1.5}
                  step={0.02}
                  value={s.lineHeight}
                  onChange={(e) => update("lineHeight", Number(e.target.value))}
                  style={{ width: "100%", cursor: "pointer" }}
                />
              </div>
            </div>
          )}

          {/* ── TAB 2: Content & Colors ── */}
          {tab === "content" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Line 1 text & color */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>
                  Line 1 Text & Color
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={s.line1Text}
                    onChange={(e) => update("line1Text", e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      fontSize: 13,
                    }}
                  />
                  <input
                    type="color"
                    value={s.line1Color}
                    onChange={(e) => update("line1Color", e.target.value)}
                    style={{
                      width: 38,
                      height: 38,
                      padding: 2,
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>

              {/* Line 2 text & color */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>
                  Line 2 Accent Text & Color
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={s.line2Text}
                    onChange={(e) => update("line2Text", e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      fontSize: 13,
                    }}
                  />
                  <input
                    type="color"
                    value={s.line2Color}
                    onChange={(e) => update("line2Color", e.target.value)}
                    style={{
                      width: 38,
                      height: 38,
                      padding: 2,
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>

              {/* Subtitle text */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>
                  Subtitle Text
                </label>
                <textarea
                  rows={2}
                  value={s.subtitleText}
                  onChange={(e) => update("subtitleText", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 12,
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Subtitle Size & Color */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 50px", gap: 8, alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 11, color: "#64748b" }}>Subtitle Size</span>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{s.subtitleSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={14}
                    max={22}
                    value={s.subtitleSize}
                    onChange={(e) => update("subtitleSize", Number(e.target.value))}
                    style={{ width: "100%", cursor: "pointer" }}
                  />
                </div>
                <input
                  type="color"
                  value={s.subtitleColor}
                  onChange={(e) => update("subtitleColor", e.target.value)}
                  style={{
                    width: "100%",
                    height: 34,
                    padding: 2,
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    cursor: "pointer",
                  }}
                />
              </div>

              {/* CTA text & Button colors */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>
                  CTA Button Text & Background
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={s.ctaText}
                    onChange={(e) => update("ctaText", e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      fontSize: 13,
                    }}
                  />
                  <input
                    type="color"
                    value={s.ctaBg}
                    onChange={(e) => update("ctaBg", e.target.value)}
                    style={{
                      width: 38,
                      height: 38,
                      padding: 2,
                      borderRadius: 8,
                      border: "1px solid #cbd5e1",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: Scene & Layout ── */}
          {tab === "scene" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Overlay Opacity */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>White Wash Opacity</label>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{s.overlayOpacity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={s.overlayOpacity}
                  onChange={(e) => update("overlayOpacity", Number(e.target.value))}
                  style={{ width: "100%", cursor: "pointer" }}
                />
              </div>

              {/* Vertical Offset */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Vertical Position Offset</label>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{s.verticalOffset}px</span>
                </div>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={s.verticalOffset}
                  onChange={(e) => update("verticalOffset", Number(e.target.value))}
                  style={{ width: "100%", cursor: "pointer" }}
                />
              </div>

              {/* Video Brightness */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Video Brightness</label>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{s.videoBrightness}%</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={160}
                  value={s.videoBrightness}
                  onChange={(e) => update("videoBrightness", Number(e.target.value))}
                  style={{ width: "100%", cursor: "pointer" }}
                />
              </div>

              {/* Video Blur */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Video Blur Filter</label>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{s.videoBlur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={s.videoBlur}
                  onChange={(e) => update("videoBlur", Number(e.target.value))}
                  style={{ width: "100%", cursor: "pointer" }}
                />
              </div>

              {/* Show Badge Toggle */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Show Social Proof Badge</span>
                <input
                  type="checkbox"
                  checked={s.showBadge}
                  onChange={(e) => update("showBadge", e.target.checked)}
                  style={{ cursor: "pointer", width: 18, height: 18 }}
                />
              </div>
            </div>
          )}

          {/* ── TAB 4: Presets & Export ── */}
          {tab === "presets" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 2 }}>
                One-Click Design Presets
              </div>
              {Object.keys(PRESETS).map((pName) => (
                <button
                  key={pName}
                  onClick={() => applyPreset(pName)}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#1a56db";
                    e.currentTarget.style.background = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{pName}</span>
                  <span style={{ fontSize: 12, color: "#1a56db" }}>Apply →</span>
                </button>
              ))}

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                <button
                  onClick={copyCSS}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    background: copied ? "#10b981" : "#111827",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 200ms ease",
                  }}
                >
                  {copied ? "✓ CSS Copied to Clipboard!" : "📋 Copy CSS Code"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ─── Stats Strip ──────────────────────────────────────────────────────────

function StatsStrip() {
  return (
    <section
      style={{
        background: C.white,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "40px 40px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          textAlign: "center",
        }}
      >
        {[
          { n: "3.2×", label: "Average retention improvement" },
          { n: "68%", label: "Score uplift in 60 days" },
          { n: "500+", label: "Students in early access" },
        ].map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: "-2px",
                color: C.obsidian,
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {s.n}
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: C.gray,
                lineHeight: 1.5,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: "🎯",
      title: "Adaptive Diagnostic",
      desc: "Pinpoints exact knowledge gaps in under 10 minutes. Maps your full subject graph before you waste time on things you already know.",
    },
    {
      icon: "🔁",
      title: "Spaced Repetition (SM-2)",
      desc: "Micro-reviews at exact memory decay inflection points. 3.2× retention compared to passive revision.",
    },
    {
      icon: "🧠",
      title: "Socratic AI Tutor",
      desc: "Progressive hints, not direct answers. Builds genuine reasoning and first-principles thinking.",
    },
    {
      icon: "📊",
      title: "Teacher Cohort Heatmaps",
      desc: "Real-time mastery matrix across every student and topic. At-risk detection 48 hours before a student fails.",
    },
    {
      icon: "👨‍👩‍👦",
      title: "Parent Progress Portal",
      desc: "Weekly digest in 10+ Indian languages. Parents understand exactly where their child needs support.",
    },
    {
      icon: "⚡",
      title: "Dynamic Path Calibration",
      desc: "Path recalibrates after every attempt. Slower students get prerequisite scaffolding; fast learners skip ahead.",
    },
  ];

  return (
    <section
      id="features"
      style={{
        background: C.canvas,
        padding: "96px 40px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#eff6ff",
              border: `1px solid #bfdbfe`,
              borderRadius: 9999,
              padding: "4px 14px",
              marginBottom: 16,
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: C.blue,
              letterSpacing: "0.02em",
            }}
          >
            Core Features
          </div>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.obsidian,
              margin: "0 0 16px",
              lineHeight: 1.15,
            }}
          >
            Everything your learning journey needs
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 17,
              color: C.gray,
              lineHeight: 1.6,
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            A unified platform that adapts to every student, scales to every classroom.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
          className="features-grid"
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: C.white,
                borderRadius: 16,
                border: `1px solid ${C.border}`,
                padding: "28px 24px",
                transition: "box-shadow 200ms, transform 200ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 8px 24px rgba(0,0,0,0.08)";
                (e.currentTarget as HTMLDivElement).style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                (e.currentTarget as HTMLDivElement).style.transform = "none";
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  marginBottom: 16,
                  lineHeight: 1,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 17,
                  fontWeight: 600,
                  color: C.obsidian,
                  margin: "0 0 10px",
                  letterSpacing: "-0.02em",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: C.gray,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", label: "Diagnose", desc: "Adaptive quiz maps your knowledge across the full prerequisite graph — under 10 minutes." },
    { n: "02", label: "Analyze", desc: "Root-cause AI pinpoints exact misconceptions causing surface errors." },
    { n: "03", label: "Personalize", desc: "Dynamic learning path auto-recalibrates after every session and attempt." },
    { n: "04", label: "Learn", desc: "Socratic AI tutor guides with hints, building real reasoning from first principles." },
    { n: "05", label: "Retain", desc: "SM-2 schedules micro-reviews at your personal memory decay curve." },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        background: C.white,
        borderTop: `1px solid ${C.border}`,
        padding: "96px 40px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#eff6ff",
              border: `1px solid #bfdbfe`,
              borderRadius: 9999,
              padding: "4px 14px",
              marginBottom: 16,
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: C.blue,
            }}
          >
            How It Works
          </div>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.obsidian,
              margin: "0 auto",
              lineHeight: 1.15,
            }}
          >
            Five steps. One closed loop.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0,
            position: "relative",
          }}
          className="steps-grid"
        >
          {/* Connector line */}
          <div
            style={{
              position: "absolute",
              top: 28,
              left: "10%",
              right: "10%",
              height: 1,
              background: C.border,
              zIndex: 0,
            }}
          />
          {steps.map((s, i) => (
            <div
              key={s.n}
              style={{
                padding: "0 16px 0",
                textAlign: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Step circle */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: i === 0 ? C.blue : C.white,
                  border: `2px solid ${i === 0 ? C.blue : C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: i === 0 ? C.white : C.gray,
                  margin: "0 auto 20px",
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: C.obsidian,
                  marginBottom: 8,
                }}
              >
                {s.label}
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: C.gray,
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── For Educators ────────────────────────────────────────────────────────
function ForEducators() {
  return (
    <section
      id="benefits"
      style={{
        background: C.canvas,
        borderTop: `1px solid ${C.border}`,
        padding: "96px 40px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
        className="edu-grid"
      >
        {/* Left */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#eff6ff",
              border: `1px solid #bfdbfe`,
              borderRadius: 9999,
              padding: "4px 14px",
              marginBottom: 20,
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: C.blue,
            }}
          >
            For Educators
          </div>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.obsidian,
              margin: "0 0 20px",
              lineHeight: 1.15,
            }}
          >
            Give every teacher AI superpowers
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: C.gray,
              lineHeight: 1.65,
              margin: "0 0 36px",
            }}
          >
            See which students are struggling on which concepts in real-time.
            Get AI-generated intervention plans before exams — not after.
          </p>
          {[
            { label: "At-Risk Detection", desc: "Alerts when mastery drops below threshold — 48h early warning" },
            { label: "Cohort Heatmaps", desc: "Live matrix across every concept in the syllabus" },
            { label: "1-Click Remediation", desc: "AI generates quiz sets calibrated to the class's gap pattern" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                gap: 14,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#eff6ff",
                  border: `1px solid #bfdbfe`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                  fontSize: 12,
                  color: C.blue,
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 15,
                    fontWeight: 600,
                    color: C.obsidian,
                    marginBottom: 4,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: C.gray,
                    lineHeight: 1.5,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
          <Link
            href="/teacher"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 44,
              padding: "0 24px",
              background: C.obsidian,
              color: C.white,
              borderRadius: 9999,
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              marginTop: 8,
            }}
          >
            Explore Teacher Dashboard →
          </Link>
        </div>

        {/* Right: Class heatmap card */}
        <div
          style={{
            background: C.white,
            borderRadius: 16,
            border: `1px solid ${C.border}`,
            padding: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {/* Card header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div>
              <div style={{ fontFamily: "'Inter'", fontSize: 14, fontWeight: 600, color: C.obsidian }}>
                Class 12-A · Data Structures
              </div>
              <div style={{ fontFamily: "'Inter'", fontSize: 12, color: C.gray, marginTop: 2 }}>
                32 students · Updated now
              </div>
            </div>
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 9999,
                padding: "4px 12px",
                fontFamily: "'Inter'",
                fontSize: 12,
                fontWeight: 600,
                color: "#b91c1c",
              }}
            >
              2 At Risk
            </div>
          </div>

          {/* Topic headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "90px repeat(5, 1fr)",
              gap: 6,
              marginBottom: 10,
            }}
          >
            <div />
            {["Arrays", "Trees", "Graphs", "DP", "OS"].map((t) => (
              <div
                key={t}
                style={{
                  fontFamily: "'Inter'",
                  fontSize: 11,
                  fontWeight: 600,
                  color: C.gray,
                  textAlign: "center",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {t}
              </div>
            ))}
          </div>

          {/* Student rows */}
          {[
            { name: "Aarav S.", scores: [88, 38, 65, 72, 80], risk: true },
            { name: "Priya M.", scores: [95, 89, 78, 85, 91], risk: false },
            { name: "Rohan M.", scores: [45, 22, 30, 18, 35], risk: true },
            { name: "Kavya P.", scores: [82, 74, 70, 77, 83], risk: false },
          ].map((row) => (
            <div
              key={row.name}
              style={{
                display: "grid",
                gridTemplateColumns: "90px repeat(5, 1fr)",
                gap: 6,
                marginBottom: 6,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Inter'",
                  fontSize: 13,
                  fontWeight: 500,
                  color: row.risk ? "#b91c1c" : C.obsidian,
                }}
              >
                {row.name}
              </div>
              {row.scores.map((sc, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    padding: "6px 4px",
                    borderRadius: 6,
                    fontFamily: "'Inter'",
                    fontSize: 12,
                    fontWeight: 600,
                    background:
                      sc >= 75
                        ? "#f0fdf4"
                        : sc >= 50
                        ? "#fffbeb"
                        : "#fef2f2",
                    color:
                      sc >= 75 ? "#15803d" : sc >= 50 ? "#b45309" : "#b91c1c",
                  }}
                >
                  {sc}%
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────
function Testimonials() {
  const quotes = [
    {
      quote:
        "AdaptiveX caught my SQL recursion and B-Tree indexing gap in 10 minutes. Jumped from Rank 180 to GATE Top 15.",
      name: "Aarav Sharma",
      role: "GATE CS 2025 · Rank 14",
      color: "#3b82f6",
    },
    {
      quote:
        "Instead of 6 hours of cramming, 15-minute micro-quizzes at exact decay points. Physics went from 48 to 92.",
      name: "Rohan Mehta",
      role: "JEE Advanced 2025",
      color: "#8b5cf6",
    },
    {
      quote:
        "The teacher analytics dashboard showed struggling students before class started. Real-time intervention at scale.",
      name: "Dr. Priya Verma",
      role: "Professor · IIT Delhi",
      color: "#f59e0b",
    },
    {
      quote:
        "The parent weekly digest in Hindi showed exactly where my son needed encouragement. I could finally understand his progress.",
      name: "Sunita Mehta",
      role: "Parent · Mumbai",
      color: "#10b981",
    },
  ];

  return (
    <section
      id="about"
      style={{
        background: C.white,
        borderTop: `1px solid ${C.border}`,
        padding: "96px 40px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#eff6ff",
              border: `1px solid #bfdbfe`,
              borderRadius: 9999,
              padding: "4px 14px",
              marginBottom: 16,
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: C.blue,
            }}
          >
            Wall of Love
          </div>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.obsidian,
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Loved by students, trusted by educators
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
          className="testimonials-grid"
        >
          {quotes.map((q) => (
            <div
              key={q.name}
              style={{
                background: C.canvas,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: 28,
                transition: "box-shadow 200ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 4px 20px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 16,
                  color: C.obsidian,
                  lineHeight: 1.65,
                  margin: "0 0 20px",
                }}
              >
                &ldquo;{q.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: q.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Inter'",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {q.name[0]}
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter'", fontSize: 14, fontWeight: 600, color: C.obsidian }}>
                    {q.name}
                  </div>
                  <div style={{ fontFamily: "'Inter'", fontSize: 13, color: C.gray }}>
                    {q.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section
      style={{
        background: C.obsidian,
        padding: "96px 40px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.12,
            color: C.white,
            margin: "0 0 20px",
          }}
        >
          Start your adaptive journey today
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 17,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.6,
            margin: "0 auto 36px",
            maxWidth: 420,
          }}
        >
          Join thousands of students unlocking true mastery with personalized diagnostic intelligence.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 50,
              padding: "0 32px",
              background: C.white,
              color: C.obsidian,
              borderRadius: 9999,
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Launch Platform →
          </Link>
          <Link
            href="/auth/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 50,
              padding: "0 32px",
              background: "transparent",
              color: "rgba(255,255,255,0.75)",
              borderRadius: 9999,
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              textDecoration: "none",
              boxShadow: "rgba(255,255,255,0.2) 0px 0px 0px 1px",
            }}
          >
            Sign In
          </Link>
        </div>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.35)",
            marginTop: 20,
          }}
        >
          No credit card required · Free plan available
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        background: C.white,
        borderTop: `1px solid ${C.border}`,
        padding: "28px 40px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: C.blue,
            }}
          >
            AdaptiveX
          </span>
          <span style={{ fontFamily: "'Inter'", fontSize: 13, color: C.gray }}>
            · Smart India Hackathon 2024
          </span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Architecture", "API Docs"].map((l) => (
            <Link
              key={l}
              href="#"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: C.gray,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.obsidian)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.gray)}
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Responsive CSS & Multi-Font Google Fonts ─────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Pacifico&family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@400;500;600;700&family=Montserrat:wght@400;600;700;800;900&family=Syne:wght@600;700;800&display=swap');
  
  .landing-root {
    color-scheme: light;
    background: #f9fafb;
  }

  @media (max-width: 768px) {
    .features-grid { grid-template-columns: 1fr 1fr !important; }
    .steps-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
    .edu-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
    .testimonials-grid { grid-template-columns: 1fr !important; }
  }

  @media (max-width: 480px) {
    .features-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─── Main Page ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(defaultHeroSettings);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="landing-root">
        <Navbar />
        <Hero s={heroSettings} />
        <StatsStrip />
        <Features />
        <HowItWorks />
        <ForEducators />
        <Testimonials />
        <CTA />
        <Footer />
        <HeroControls s={heroSettings} setS={setHeroSettings} />
      </div>
    </>
  );
}
