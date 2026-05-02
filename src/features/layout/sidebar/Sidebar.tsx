import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarMenu } from "./components/SidebarMenu";
import { SidebarUserSection } from "./components/SidebarUserSection";
import { useSidebarCollapsed } from "./sidebar.store";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const isCollapsed = useSidebarCollapsed();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen flex flex-col bg-background border-r border-outline-variant/30 transition-all duration-300 z-50",
        isCollapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <SidebarHeader />
      <SidebarMenu />
      <SidebarUserSection />
    </aside>
  );
}
