import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, LogOut, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { UserRole } from "@/types";
import { getNavForRole } from "@/config/navigation";
import type { NavItem } from "@/types/navigation";

interface SidebarProps {
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

const MOBILE_BREAKPOINT = 768; // md breakpoint

export default function Sidebar({
  userRole,
  userName,
  onLogout,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [heights, setHeights] = useState<Record<string, number>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const location = useLocation();
  const pathname = location.pathname;

  const navLinks = getNavForRole(userRole);

  const toggleDropdown = (title: string) => {
    setOpenDropdowns(prev => {
      // If we're opening the dropdown, calculate its height
      if (!prev[title] && dropdownRefs.current[title]) {
        const height = dropdownRefs.current[title]?.scrollHeight || 0;
        setHeights(prevHeights => ({
          ...prevHeights,
          [title]: height
        }));
      }
      return {
        ...prev,
        [title]: !prev[title]
      };
    });
  };

  const isActive = (item: NavItem): boolean => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => isActive(child));
    }
    return false;
  };

  // Check if mobile on mount and on window resize
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsCollapsed(true);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isCollapsed && isMobile) {
      const handleClickOutside = (event: MouseEvent) => {
        const sidebar = document.querySelector(".sidebar");
        const toggleButton = document.querySelector(".sidebar-toggle");

        if (
          sidebar &&
          !sidebar.contains(event.target as Node) &&
          toggleButton &&
          !toggleButton.contains(event.target as Node)
        ) {
          setIsCollapsed(true);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isCollapsed, isMobile]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed left-4 top-4 z-40 md:hidden p-2 rounded-md bg-white shadow-md border",
          "sidebar-toggle cursor-pointer hover:bg-slate-50 transition-colors"
        )}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay for mobile */}
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:relative z-40 flex h-full flex-col border-r bg-slate-50 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64",
          isMobile && !isCollapsed ? "left-0" : "-left-full md:left-0",
          "sidebar"
        )}
      >
        <div className="relative border-b p-4">
          <div
            className={cn(
              "transition-opacity",
              isCollapsed ? "opacity-0 w-0 h-0 overflow-hidden" : "opacity-100"
            )}
          >
            <h1 className="text-2xl font-bold text-slate-900 whitespace-nowrap">
              CopyFlow
            </h1>
            <p className="text-sm text-slate-600 mt-1 whitespace-nowrap">
              School Workflow
            </p>
          </div>
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md hover:bg-slate-100 cursor-pointer transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isItemActive = isActive(item);
              const isDropdownOpen = openDropdowns[item.title] || false;

              const handleClick = (e: React.MouseEvent) => {
                if (isMobile) {
                  setIsCollapsed(true);
                }
                if (hasChildren) {
                  e.preventDefault();
                  toggleDropdown(item.title);
                }
              };

              return (
                <div key={item.href || item.title} className="space-y-1">
                  <Link
                    to={item.href || '#'}
                    title={isCollapsed ? item.title : undefined}
                    onClick={handleClick}
                    onClickCapture={(e) => hasChildren && e.preventDefault()}
                  >
                    <Button
                      variant={isItemActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-between overflow-hidden transition-all duration-200 group",
                        isItemActive && "bg-slate-200 text-slate-900",
                        isCollapsed ? "px-2" : "px-4"
                      )}
                    >
                      <div className="flex items-center">
                        {Icon && (
                          <Icon
                            className={cn(
                              "h-5 w-5 flex-shrink-0",
                              !isCollapsed && "mr-3"
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            "whitespace-nowrap transition-opacity text-left",
                            isCollapsed ? "opacity-0 w-0" : "opacity-100"
                          )}
                        >
                          {item.title}
                        </span>
                      </div>
                      {hasChildren && !isCollapsed && (
                        <span className="ml-2">
                          {isDropdownOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </Button>
                  </Link>

                  {hasChildren && !isCollapsed && (
                    <div 
                      ref={el => {
                        if (el) {
                          dropdownRefs.current[item.title] = el;
                        }
                      }}
                      className={cn(
                        'ml-6 space-y-1 mt-1 overflow-hidden transition-all duration-300 ease-in-out',
                        isDropdownOpen ? 'opacity-100' : 'opacity-0 max-h-0'
                      )}
                      style={{
                        maxHeight: isDropdownOpen ? `${heights[item.title] || 200}px` : '0px',
                        transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-10px)'
                      }}
                    >
                      {item.children?.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            to={child.href || '#'}
                            className="block"
                            onClick={() => isMobile && setIsCollapsed(true)}
                          >
                            <Button
                              variant={isChildActive ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start pl-8 text-sm",
                                isChildActive && "bg-slate-100 text-slate-900"
                              )}
                            >
                              {child.title}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="border-t p-4">
          <div
            className={cn(
              "mb-3 px-2 transition-opacity",
              isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            )}
          >
            <p className="text-sm font-medium text-slate-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-slate-600 capitalize">{userRole}</p>
          </div>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start transition-all duration-200",
              isCollapsed ? "p-2" : "px-4"
            )}
            onClick={onLogout}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut
              className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")}
            />
            <span
              className={cn(
                "whitespace-nowrap transition-opacity",
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              )}
            >
              Logout
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}
