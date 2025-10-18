import { AuthLayout } from "@/layouts";
import { Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/auth";

export const appRoutes = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <LoginPage /> },
    ],
  },
];
