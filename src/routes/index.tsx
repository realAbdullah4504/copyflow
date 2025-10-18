// src/routes/index.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import { AuthLayout } from "@/layouts";
import { LoginPage } from "@/pages/auth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
