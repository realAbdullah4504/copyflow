import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { AdminPage, SecretaryPage, TeacherPage } from "@/pages/dashboard";
import { DashboardLayout } from "@/components/layouts";
export const privateRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "teacher",
        element: <TeacherPage />,
      },
      {
        path: "secretary",
        element: <SecretaryPage />,
      },
    ],
  },
];
