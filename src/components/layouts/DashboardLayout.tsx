import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar, Header } from "@/components/dashboard";
import BreadcrumbNavigation from "@/components/common/BreadcrumbNavigation";

const DashboardLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();



  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        userRole={user.role}
        userName={user.name}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={<BreadcrumbNavigation />} userName={user.name} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
