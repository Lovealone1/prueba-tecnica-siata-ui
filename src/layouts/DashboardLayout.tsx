import { Outlet } from "react-router-dom";
import { Sidebar } from "@/features/layout/sidebar/Sidebar";
import { useSidebarCollapsed } from "@/features/layout/sidebar/sidebar.store";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const isCollapsed = useSidebarCollapsed();

  return (
    <div className="min-h-screen flex bg-background dark:bg-background transition-colors duration-300">
      <Sidebar />
      <main
        className={cn(
          "flex-grow transition-all duration-300 p-6 md:p-8",
          isCollapsed ? "ml-[72px]" : "ml-[240px]"
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
