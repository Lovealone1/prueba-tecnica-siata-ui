import { Navigate, useLocation } from "react-router-dom";
import { useIsAuthenticated } from "@/store/auth.store";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard protects private routes by redirecting unauthenticated users to login.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login but save the current location to return after login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
