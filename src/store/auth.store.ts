import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/features/auth/types/auth.types";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "siata-auth-storage",
    }
  )
);

/**
 * Selectors for optimized re-renders
 */
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUserRole = () => useAuthStore((state) => state.user?.global_role);
