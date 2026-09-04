"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { AuthProvider } from "@/lib/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const ThemeProviderAny = ThemeProvider as any;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProviderAny
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange={false}
      >
        <AuthProvider>{children}</AuthProvider>
      </ThemeProviderAny>
    </QueryClientProvider>
  );
}
