import type { RouteObject } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts";
import {
  AdminDashboard,
  AdminSubmissions,
  AdminSettings,
  Users,
  TeacherPage,
  SecretaryPage,
} from "@/pages/dashboard";
import { ProtectedRoute, RootRedirect } from "@/components/guards";

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
      { index: true, element: <RootRedirect /> },
      {
        path: "admin",
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "users", element: <Users /> },
          { path: "settings", element: <AdminSettings /> },
          { path: "submissions", element: <AdminSubmissions /> },
        ],
      },
      // Teacher Routes
      {
        path: "teacher",
        children: [
          { index: true, element: <TeacherPage /> },
          // { path: "classes", element: <TeacherClassesPage /> },
          // { path: "attendance", element: <TeacherAttendancePage /> },
        ],
      },
      // Secretary Routes
      {
        path: "secretary",
        children: [
          { index: true, element: <SecretaryPage /> },
          // { path: "reports", element: <SecretaryReportsPage /> },
          // { path: "documents", element: <SecretaryDocumentsPage /> },
        ],
      },
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
