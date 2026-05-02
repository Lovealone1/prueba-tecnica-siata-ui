import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/features/auth/types/auth.types";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (accessToken, user) => set({ accessToken, user, isAuthenticated: true }),
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        set({ accessToken: null, user: null, isAuthenticated: false });
        localStorage.removeItem("siata-auth-storage");
      },
    }),
    {
      name: "siata-auth-storage",
    }
  )
);

/**
 * Selectors for optimized re-renders
 */
export const useAuthAccessToken = () => useAuthStore((state) => state.accessToken);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUserRole = () => useAuthStore((state) => state.user?.global_role);
export const useLogout = () => useAuthStore((state) => state.logout);
