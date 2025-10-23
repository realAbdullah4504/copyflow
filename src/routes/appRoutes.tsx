import { AuthLayout } from "@/components/layouts";
import { Navigate } from "react-router-dom";
import { LoginPage, SignupPage } from "@/pages/auth";
import { Unauthorized } from "@/pages/errors/Unauthorized";
import { NotFound } from "@/pages/errors/NotFound";
import { RootRedirect } from "@/components/guards";

export const appRoutes = [
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
