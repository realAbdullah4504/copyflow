import { Outlet } from "react-router-dom";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1">
          <div className="flex h-full flex-col">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
              <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                  <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                </div>
              </div>
              <div className="flex-1">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity md:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 -translate-x-full transform transition-transform duration-300 ease-in-out md:hidden",
          sidebarOpen && "translate-x-0"
        )}
      >
        <div className="h-full border-r bg-background">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
