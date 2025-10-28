import type { RouteObject } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts";
import {
  AdminDashboard,
  AdminSubmissions,
  AdminSettings,
  Users,
  TeacherPage,
  TeacherSubmissionsPage,
  TeacherArchivePage,
  SecretaryPage,
  SecretaryArchivePage,
  AdminArchive,
  SecretarySubmissionsPage,
  SecretaryCensorshipPage,
  AdminCensorshipPage,
  TeacherCensorshipPage,
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
          { path: "censorship", element: <AdminCensorshipPage /> },
          { path: "archive", element: <AdminArchive /> },
        ],
      },
      // Teacher Routes
      {
        path: "teacher",
        children: [
          { index: true, element: <TeacherPage /> },
          { path: "submissions", element: <TeacherSubmissionsPage /> },
          { path: "archive", element: <TeacherArchivePage /> },
          { path: "censorship", element: <TeacherCensorshipPage /> },
        ],
      },
      // Secretary Routes
      {
        path: "secretary",
        children: [
          { index: true, element: <SecretaryPage /> },
          { path: "archive", element: <SecretaryArchivePage /> },
          { path: "submissions", element: <SecretarySubmissionsPage /> },
          { path: "censorship", element: <SecretaryCensorshipPage /> },
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
