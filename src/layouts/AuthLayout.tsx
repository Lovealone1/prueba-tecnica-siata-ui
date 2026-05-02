import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function AuthLayout() {
  return (
    <div>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
