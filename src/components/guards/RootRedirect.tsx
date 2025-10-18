import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const RootRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/auth/login" />;

  // Redirect to dashboard based on role
  switch (user.role) {
    case "admin":
      return <Navigate to="/dashboard/admin" />;
    case "teacher":
      return <Navigate to="/dashboard/teacher" />;
    case "secretary":
      return <Navigate to="/dashboard/secretary" />;
    case "principal":
      return <Navigate to="/dashboard/principal" />;
    default:
      return <Navigate to="/dashboard/common" />;
  }
};

export default RootRedirect;
