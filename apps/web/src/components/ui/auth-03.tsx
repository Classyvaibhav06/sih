"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { cn } from "@/lib/utils";

export interface Auth3SocialProvider {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export interface Auth3Props {
  brandName?: string;
  brandDescriptor?: string;
  socialProviders?: Auth3SocialProvider[];
  dividerText?: string;
  signInLabel?: string;
  signUpLabel?: string;
  forgotPasswordText?: string;
  onForgotPassword?: () => void;
  onSignIn?: (email: string, password: string) => void;
  onSignUp?: (name: string, email: string, password: string, role?: string) => void;
  termsHref?: string;
  privacyHref?: string;
}

const DEFAULT_SOCIAL_PROVIDERS: Auth3SocialProvider[] = [
  {
    id: "google",
    label: "Google",
    icon: <FaGoogle size={16} color="#ea4335" />,
  },
  {
    id: "github",
    label: "GitHub",
    icon: <FaGithub size={16} />,
  },
];

interface PasswordInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}

function PasswordInput({ id, placeholder, value, onChange, autoComplete }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400 dark:text-neutral-500">
        <Lock className="h-4 w-4" />
      </div>
      <Input
        id={id}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="h-11 rounded-xl border border-neutral-700/80 bg-neutral-900/90 !pl-11 pr-10 text-sm font-medium text-neutral-100 placeholder:text-neutral-500 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30"
        required
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200 transition-colors"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export function Auth3({
  socialProviders = DEFAULT_SOCIAL_PROVIDERS,
  dividerText = "or continue with email",
  signInLabel = "Sign In to AdaptiveX",
  signUpLabel = "Create Account",
  forgotPasswordText = "Forgot password?",
  onForgotPassword,
  onSignIn,
  onSignUp,
  termsHref = "#",
  privacyHref = "#",
}: Auth3Props) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign-in form state
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign-up form state
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suRole, setSuRole] = useState("student");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn?.(siEmail, siPassword);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp?.(suName, suEmail, suPassword, suRole);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/90 dark:shadow-black/60">
        <Tabs
          value={activeTab}
          onValueChange={(v: string) => setActiveTab(v as "signin" | "signup")}
          className="w-full"
        >
          {/* Header tabs bar */}
          <div className="border-b border-neutral-200/80 px-6 pt-6 pb-0 dark:border-neutral-800/80">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-neutral-100 p-1 dark:bg-neutral-900">
              <TabsTrigger
                value="signin"
                className="rounded-xl py-2.5 text-xs font-bold tracking-wide transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-white"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-xl py-2.5 text-xs font-bold tracking-wide transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── Sign-in Form ── */}
          <TabsContent value="signin" className="p-6 pt-5 mt-0 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {socialProviders.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  type="button"
                  className="h-11 gap-2.5 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-800 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
                  onClick={provider.onClick}
                >
                  {provider.icon}
                  <span>{provider.label}</span>
                </Button>
              ))}
            </div>

            <div className="relative flex items-center justify-center">
              <Separator className="w-full bg-neutral-200 dark:bg-neutral-800" />
              <span className="absolute bg-white px-3 text-xs font-medium text-neutral-400 dark:bg-neutral-950 dark:text-neutral-500">
                {dividerText}
              </span>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="auth3-si-email"
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400 dark:text-neutral-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="auth3-si-email"
                    type="email"
                    placeholder="student@demo.adaptivex.ai"
                    value={siEmail}
                    onChange={(e) => setSiEmail(e.target.value)}
                    autoComplete="email"
                    className="h-11 rounded-xl border border-neutral-700/80 bg-neutral-900/90 !pl-11 text-sm font-medium text-neutral-100 placeholder:text-neutral-500 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="auth3-si-password"
                    className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    {forgotPasswordText}
                  </button>
                </div>
                <PasswordInput
                  id="auth3-si-password"
                  placeholder="••••••••••••"
                  value={siPassword}
                  onChange={setSiPassword}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="mt-2 h-11 w-full gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{signInLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </TabsContent>

          {/* ── Sign-up Form ── */}
          <TabsContent value="signup" className="p-6 pt-5 mt-0 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {socialProviders.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  type="button"
                  className="h-11 gap-2.5 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-800 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
                  onClick={provider.onClick}
                >
                  {provider.icon}
                  <span>{provider.label}</span>
                </Button>
              ))}
            </div>

            <div className="relative flex items-center justify-center">
              <Separator className="w-full bg-neutral-200 dark:bg-neutral-800" />
              <span className="absolute bg-white px-3 text-xs font-medium text-neutral-400 dark:bg-neutral-950 dark:text-neutral-500">
                {dividerText}
              </span>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Role selection pills */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Select Role
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "student", label: "🎓 Student" },
                    { id: "teacher", label: "📚 Teacher" },
                    { id: "parent", label: "👨‍👩‍👦 Parent" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSuRole(r.id)}
                      className={cn(
                        "rounded-xl py-2 text-xs font-semibold transition-all border",
                        suRole === r.id
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300 shadow-xs"
                          : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="auth3-su-name"
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400 dark:text-neutral-500">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    id="auth3-su-name"
                    type="text"
                    placeholder="Aarav Sharma"
                    value={suName}
                    onChange={(e) => setSuName(e.target.value)}
                    autoComplete="name"
                    className="h-11 rounded-xl border border-neutral-200 bg-neutral-50/80 pl-10 text-sm font-medium text-neutral-900 transition-all placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/15 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus-visible:border-blue-500 dark:focus-visible:bg-neutral-950"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="auth3-su-email"
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400 dark:text-neutral-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="auth3-su-email"
                    type="email"
                    placeholder="aarav@university.edu"
                    value={suEmail}
                    onChange={(e) => setSuEmail(e.target.value)}
                    className="h-11 rounded-xl border border-neutral-200 bg-neutral-50/80 pl-10 text-sm font-medium text-neutral-900 transition-all placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/15 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus-visible:border-blue-500 dark:focus-visible:bg-neutral-950"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="auth3-su-password"
                  className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Create Password
                </Label>
                <PasswordInput
                  id="auth3-su-password"
                  placeholder="Min. 8 characters"
                  value={suPassword}
                  onChange={setSuPassword}
                />
              </div>

              <Button
                type="submit"
                className="mt-2 h-11 w-full gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{signUpLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pt-1">
                By creating an account you agree to our{" "}
                <a
                  href={termsHref}
                  className="text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline font-medium"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href={privacyHref}
                  className="text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline font-medium"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
