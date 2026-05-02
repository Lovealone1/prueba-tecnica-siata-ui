import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (isCollapsed) => set({ isCollapsed }),
    }),
    {
      name: "siata-sidebar-storage",
    }
  )
);

export const useSidebarCollapsed = () => useSidebarStore((state) => state.isCollapsed);
export const useSidebarActions = () => ({
  toggle: useSidebarStore((state) => state.toggle),
  setCollapsed: useSidebarStore((state) => state.setCollapsed),
});
