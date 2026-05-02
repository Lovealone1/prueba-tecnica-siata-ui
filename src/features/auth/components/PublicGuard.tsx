import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "@/store/auth.store";

interface PublicGuardProps {
  children: React.ReactNode;
}

/**
 * PublicGuard prevents authenticated users from accessing public auth routes
 * (like login and otp verification).
 */
export function PublicGuard({ children }: PublicGuardProps) {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    // If already logged in, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
