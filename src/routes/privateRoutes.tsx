import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts";
import { ProtectedRoute, RootRedirect } from "@/components/guards";
import { Loader2 } from "lucide-react";

// Lazy load all page components
const AdminDashboard = lazy(
  () => import("@/pages/dashboard/admin/DashboardPage")
);
const AdminSubmissions = lazy(
  () => import("@/pages/dashboard/admin/SubmissionsPage")
);
const Users = lazy(() => import("@/pages/dashboard/admin/UsersPage"));
const TeacherSubmissionsPage = lazy(
  () => import("@/pages/dashboard/teacher/SubmissionPage")
);
const TeacherArchivePage = lazy(
  () => import("@/pages/dashboard/teacher/ArchivePage")
);
const SecretaryArchivePage = lazy(
  () => import("@/pages/dashboard/secretary/ArchivePage")
);
const AdminArchive = lazy(() => import("@/pages/dashboard/admin/ArchivePage"));
const SecretarySubmissionsPage = lazy(
  () => import("@/pages/dashboard/secretary/SubmissionPage")
);
const SecretaryCensorshipPage = lazy(
  () => import("@/pages/dashboard/secretary/CensorshipPage")
);
const AdminCensorshipPage = lazy(
  () => import("@/pages/dashboard/admin/CensorshipPage")
);
const TeacherClassesPage = lazy(
  () => import("@/pages/dashboard/teacher/ClassesPage")
);
const AdminClassesPage = lazy(() => import("@/pages/dashboard/admin/classes"));
const SecretaryClassesPage = lazy(
  () => import("@/pages/dashboard/secretary/ClassesPage")
);

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

export const privateRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <DashboardLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      // Admin Routes
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RootRedirect />
          </Suspense>
        ),
      },
      {
        path: "admin",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AdminDashboard />
              </Suspense>
            ),
          },
          {
            path: "users",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Users />
              </Suspense>
            ),
          },
          {
            path: "submissions",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AdminSubmissions />
              </Suspense>
            ),
          },
          {
            path: "censorship",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AdminCensorshipPage />
              </Suspense>
            ),
          },
          {
            path: "archive",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AdminArchive />
              </Suspense>
            ),
          },
          {
            path: "classes",
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminClassesPage />
                  </Suspense>
                ),
              },
              {
                path: ":grade",
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminClassesPage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      // Teacher Routes
      {
        path: "teacher",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <TeacherSubmissionsPage />
              </Suspense>
            ),
          },
          {
            path: "classes",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <TeacherClassesPage />
              </Suspense>
            ),
          },
          {
            path: "archive",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <TeacherArchivePage />
              </Suspense>
            ),
          },
        ],
      },
      // Secretary Routes
      {
        path: "secretary",
        children: [
          // { index: true, element: <SecretaryPage /> },
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <SecretarySubmissionsPage />
              </Suspense>
            ),
          },
          {
            path: "classes",
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <SecretaryClassesPage />
                  </Suspense>
                ),
              },
              {
                path: ":grade",
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <SecretaryClassesPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: "archive",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <SecretaryArchivePage />
              </Suspense>
            ),
          },
          {
            path: "censorship",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <SecretaryCensorshipPage />
              </Suspense>
            ),
          },
        ],
      },

      // Principal Routes
      {
        path:"principal",
        
      }
    ],
  },
];
