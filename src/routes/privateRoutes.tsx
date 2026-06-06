import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts";
import { ProtectedRoute, RootRedirect } from "@/components/guards";
import { Loader2 } from "lucide-react";

// Lazy load all page components
const AdminDashboard = lazy(() => import("@/pages/dashboard/admin/DashboardPage"));
const AdminSubmissions = lazy(() => import("@/pages/dashboard/admin/SubmissionsPage"));
const Users = lazy(() => import("@/pages/dashboard/admin/UsersPage"));
const TeacherSubmissionsPage = lazy(() => import("@/pages/dashboard/teacher/SubmissionPage"));
const TeacherArchivePage = lazy(() => import("@/pages/dashboard/teacher/ArchivePage"));
const SecretaryArchivePage = lazy(() => import("@/pages/dashboard/secretary/ArchivePage"));
const AdminArchive = lazy(() => import("@/pages/dashboard/admin/ArchivePage"));
const SecretarySubmissionsPage = lazy(() => import("@/pages/dashboard/secretary/SubmissionPage"));
const SecretaryCensorshipPage = lazy(() => import("@/pages/dashboard/secretary/CensorshipPage"));
const AdminCensorshipPage = lazy(() => import("@/pages/dashboard/admin/CensorshipPage"));
const TeacherClassesPage = lazy(() => import("@/pages/dashboard/teacher/ClassesPage"));
const AdminClassesPage = lazy(() => import("@/pages/dashboard/admin/classes"));
const SecretaryClassesPage = lazy(() => import("@/pages/dashboard/secretary/ClassesPage"));
const SecretaryStudentsPage = lazy(() => import("@/pages/dashboard/secretary/StudentsPage"));

// Attendance pages — entry & report
const AttendanceEntryPage = lazy(() => import("@/pages/dashboard/secretary/AttendanceEntryPage"));
const AttendanceReportPage = lazy(() => import("@/pages/dashboard/secretary/AttendanceReportPage"));

const PrincipalTeachersPage = lazy(() => import("@/pages/dashboard/principal/TeachersPage"));
const PrincipalArchivePage = lazy(() => import("@/pages/dashboard/principal/ArchivePage"));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

const SuspenseWrap = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);

export const privateRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <SuspenseWrap>
          <DashboardLayout />
        </SuspenseWrap>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SuspenseWrap><RootRedirect /></SuspenseWrap>,
      },
      // Admin Routes
      {
        path: "admin",
        children: [
          { index: true, element: <SuspenseWrap><AdminDashboard /></SuspenseWrap> },
          { path: "users", element: <SuspenseWrap><Users /></SuspenseWrap> },
          { path: "submissions", element: <SuspenseWrap><AdminSubmissions /></SuspenseWrap> },
          { path: "censorship", element: <SuspenseWrap><AdminCensorshipPage /></SuspenseWrap> },
          { path: "archive", element: <SuspenseWrap><AdminArchive /></SuspenseWrap> },
          {
            path: "classes",
            children: [
              { index: true, element: <SuspenseWrap><AdminClassesPage /></SuspenseWrap> },
              { path: ":grade", element: <SuspenseWrap><AdminClassesPage /></SuspenseWrap> },
            ],
          },
          {
            path: "attendance",
            children: [
              { path: "entry", element: <SuspenseWrap><AttendanceEntryPage /></SuspenseWrap> },
              { path: "report", element: <SuspenseWrap><AttendanceReportPage /></SuspenseWrap> },
            ],
          },
        ],
      },
      // Teacher Routes
      {
        path: "teacher",
        children: [
          { index: true, element: <SuspenseWrap><TeacherSubmissionsPage /></SuspenseWrap> },
          { path: "classes", element: <SuspenseWrap><TeacherClassesPage /></SuspenseWrap> },
          { path: "archive", element: <SuspenseWrap><TeacherArchivePage /></SuspenseWrap> },
        ],
      },
      // Secretary Routes
      {
        path: "secretary",
        children: [
          { index: true, element: <SuspenseWrap><SecretarySubmissionsPage /></SuspenseWrap> },
          {
            path: "classes",
            children: [
              { index: true, element: <SuspenseWrap><SecretaryClassesPage /></SuspenseWrap> },
              { path: ":grade", element: <SuspenseWrap><SecretaryClassesPage /></SuspenseWrap> },
            ],
          },
          { path: "archive", element: <SuspenseWrap><SecretaryArchivePage /></SuspenseWrap> },
          { path: "censorship", element: <SuspenseWrap><SecretaryCensorshipPage /></SuspenseWrap> },
          { path: "students", element: <SuspenseWrap><SecretaryStudentsPage /></SuspenseWrap> },
          {
            path: "attendance",
            children: [
              { path: "entry", element: <SuspenseWrap><AttendanceEntryPage /></SuspenseWrap> },
              { path: "report", element: <SuspenseWrap><AttendanceReportPage /></SuspenseWrap> },
            ],
          },
        ],
      },
      // Principal Routes
      {
        path: "principal",
        children: [
          { index: true, element: <SuspenseWrap><PrincipalTeachersPage /></SuspenseWrap> },
          { path: "archive", element: <SuspenseWrap><PrincipalArchivePage /></SuspenseWrap> },
          {
            path: "attendance",
            children: [
              { path: "entry", element: <SuspenseWrap><AttendanceEntryPage readOnly /></SuspenseWrap> },
              { path: "report", element: <SuspenseWrap><AttendanceReportPage readOnly /></SuspenseWrap> },
            ],
          },
        ],
      },
    ],
  },
];
