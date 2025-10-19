import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { DashboardLayout } from "@/components/layouts";
import { AdminPage } from "@/pages/dashboard";
import Users from "@/pages/dashboard/admin/Users";
import Settings from "@/pages/dashboard/admin/Settings";
import { Navigate } from "react-router-dom";

export const privateRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Admin Routes
      { index: true, element: <Navigate to="admin" replace /> },
      {
        path: "admin",
        children: [
          { index: true, element: <AdminPage /> },
          { path: "users", element: <Users /> },
          { path: "settings", element: <Settings /> },
        ],
      },
      // Teacher Routes
      // {
      //   path: "teacher",
      //   children: [
      //     { index: true, element: <TeacherPage /> },
      //     { path: "classes", element: <TeacherClassesPage /> },
      //     { path: "attendance", element: <TeacherAttendancePage /> },
      //   ],
      // },
      // // Secretary Routes
      // {
      //   path: "secretary",
      //   children: [
      //     { index: true, element: <SecretaryPage /> },
      //     { path: "reports", element: <SecretaryReportsPage /> },
      //     { path: "documents", element: <SecretaryDocumentsPage /> },
      //   ],
      // },
      // // Principal Routes
      // {
      //   path: "principal",
      //   children: [
      //     { index: true, element: <PrincipalPage /> },
      //     { path: "overview", element: <PrincipalOverviewPage /> },
      //     { path: "reports", element: <PrincipalReportsPage /> },
      //   ],
      // },
    ],
  },
];
