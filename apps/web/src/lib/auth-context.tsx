"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  api,
  UserProfile,
  getStoredToken,
  getStoredUser,
  clearStoredAuth,
} from "./api";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  quickFill: (role: "student" | "teacher" | "parent" | "admin") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = getStoredToken();
    const savedUser = getStoredUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password = "password123") => {
    setIsLoading(true);
    try {
      const { access_token, user: loggedUser } = await api.auth.login(
        email,
        password
      );
      setToken(access_token);
      setUser(loggedUser);

      // Route based on role
      if (loggedUser.role === "teacher") {
        router.push("/teacher");
      } else if (loggedUser.role === "parent") {
        router.push("/parent");
      } else {
        router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickFill = async (role: "student" | "teacher" | "parent" | "admin") => {
    const roleEmails: Record<string, string> = {
      student: "aarav@demo.adaptivex.ai",
      teacher: "priya.teacher@demo.adaptivex.ai",
      parent: "parent@demo.adaptivex.ai",
      admin: "admin@demo.adaptivex.ai",
    };
    await login(roleEmails[role] || "aarav@demo.adaptivex.ai", "Demo@1234");
  };

  const logout = () => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        quickFill,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
