import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { OtpPage } from "@/features/auth/pages/OtpPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { CustomerListPage } from "@/features/customer/pages/CustomerListPage";
import { ProductListPage } from "@/features/product/pages/ProductListPage";
import { LogisticsPage } from "@/features/logistics/pages/LogisticsPage";
import { ShipmentListPage } from "@/features/shipment/pages/ShipmentListPage";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { PublicGuard } from "@/features/auth/components/PublicGuard";
import { RoleGuard } from "@/features/auth/components/RoleGuard";
import { GlobalRole } from "@/features/auth/types/auth.types";
import { NotFoundPage } from "@/features/layout/pages/NotFoundPage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminPage } from "@/features/admin/pages/AdminPage";
import { UserListPage } from "@/features/user/pages/UserListPage";
import { AdminShipmentListPage } from "@/features/admin/pages/AdminShipmentListPage";
import { LandingPage } from "@/features/layout/pages/LandingPage";
import { FrontendArchitecturePage } from "@/features/layout/pages/FrontendArchitecturePage";
import { BackendArchitecturePage } from "@/features/layout/pages/BackendArchitecturePage";
import { DatabaseArchitecturePage } from "@/features/layout/pages/DatabaseArchitecturePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/frontend-architecture",
    element: <FrontendArchitecturePage />,
  },
  {
    path: "/backend-architecture",
    element: <BackendArchitecturePage />,
  },
  {
    path: "/database-architecture",
    element: <DatabaseArchitecturePage />,
  },
  {
    path: "/dashboard",
    element: (
      <ErrorBoundary>
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "customers",
        element: (
          <RoleGuard allowedRoles={[GlobalRole.ADMIN, GlobalRole.USER]}>
            <CustomerListPage />
          </RoleGuard>
        ),
      },
      {
        path: "products",
        element: <ProductListPage />,
      },
      {
        path: "logistics",
        element: <LogisticsPage />,
      },
      {
        path: "shipments",
        element: <ShipmentListPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ErrorBoundary>
        <AuthGuard>
          <RoleGuard allowedRoles={[GlobalRole.ADMIN]}>
            <AdminLayout />
          </RoleGuard>
        </AuthGuard>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="users" replace />,
      },
      {
        path: "users",
        element: <UserListPage />,
      },
      {
        path: "shipments",
        element: <AdminShipmentListPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <ErrorBoundary>
        <PublicGuard>
          <AuthLayout />
        </PublicGuard>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "otp",
        element: <OtpPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
