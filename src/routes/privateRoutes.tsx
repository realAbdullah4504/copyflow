import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminPage, SecretaryPage, TeacherPage } from "@/pages/dashboard";
export const privateRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        path: "index",
        element: <AdminPage />,
      },
    ],
  },
  {
    path: "/teacher",
    element: <ProtectedRoute />,
    children: [
      {
        path: "index",
        element: <TeacherPage />,
      },
    ],
  },
  {
    path: "/secretary",
    element: <ProtectedRoute />,
    children: [
      {
        path: "index",
        element: <SecretaryPage />,
      },
    ],
  },
];
