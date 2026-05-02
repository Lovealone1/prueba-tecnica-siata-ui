import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "customers",
        element: <CustomerListPage />,
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
    path: "/auth",
    element: (
      <PublicGuard>
        <AuthLayout />
      </PublicGuard>
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
    element: <Navigate to="/" replace />,
  },
]);
