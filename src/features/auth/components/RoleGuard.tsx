import { Navigate } from "react-router-dom";
import { useAuthUser } from "@/store/auth.store";

import { GlobalRole } from "@/features/auth/types/auth.types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: GlobalRole[];
}

/**
 * RoleGuard restricts access to routes based on the user's global_role.
 */
export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const user = useAuthUser();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const hasAccess = allowedRoles.includes(user.global_role as GlobalRole);

  if (!hasAccess) {

    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
