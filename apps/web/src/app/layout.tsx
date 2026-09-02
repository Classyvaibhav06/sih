import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AdaptiveX AI — Adaptive Learning Platform",
    template: "%s | AdaptiveX AI",
  },
  description:
    "An AI-powered adaptive learning platform that understands what each learner knows, what they struggle with, and what they should learn next.",
  keywords: [
    "adaptive learning",
    "AI tutor",
    "personalized education",
    "knowledge graph",
    "spaced repetition",
    "mastery learning",
    "India education",
    "CBSE",
    "competitive exams",
  ],
  authors: [{ name: "AdaptiveX AI" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AdaptiveX AI",
  },
  openGraph: {
    type: "website",
    title: "AdaptiveX AI — Adaptive Learning Platform",
    description:
      "AI-powered adaptive education that continuously understands every learner and dynamically decides what they should learn next.",
    siteName: "AdaptiveX AI",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#040d21" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.variable} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
