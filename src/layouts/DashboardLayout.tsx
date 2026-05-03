import { Outlet } from "react-router-dom";
import { Sidebar } from "@/features/layout/sidebar/Sidebar";
import { PageHeader } from "@/features/layout/PageHeader";
import { useSidebarCollapsed } from "@/features/layout/sidebar/sidebar.store";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const isCollapsed = useSidebarCollapsed();

  return (
    <div className="min-h-screen flex bg-background dark:bg-background transition-colors duration-300">
      <Sidebar />
      <main
        className={cn(
          "flex-grow transition-all duration-300 p-4 md:p-6",
          isCollapsed ? "ml-[72px]" : "ml-[240px]"
        )}
      >
        <div className="w-full">
          <PageHeader />
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
