import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { FullPageSpinner } from "../ui/loading-spinner";

const RootRedirect = () => {
  const { isAuthenticated, user,isLoading } = useAuth();

  if(isLoading) return <FullPageSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth/login" />;

  // Redirect to dashboard based on role
  switch (user?.role) {
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
