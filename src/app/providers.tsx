import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { NotifierProvider } from "@/providers/NotifierProvider";
import { queryClient } from "./query-client";
import { type ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="siata-theme">
        {children}
        <NotifierProvider />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
