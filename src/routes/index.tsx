// src/routes/index.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "@/layouts";
import { LoginPage } from "@/pages/auth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/login" />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <LoginPage /> },
    ],
  },
]);
