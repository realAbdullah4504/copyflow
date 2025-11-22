import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useGetNotifications,
} from "@/hooks";
import { useEffect, useCallback } from "react";
import { notificationService } from "@/services";
import { formatDistanceToNow } from "date-fns";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/config";

interface HeaderProps {
  title: ReactNode;
  userName: string;
  userId: string;
  onLogout: () => void;
}

export default function Header({
  title,
  userName,
  userId,
  onLogout,
}: HeaderProps) {
  const {
    data: notifications,
    isLoading,
    refetch,
  } = useGetNotifications(userId);
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = notificationService.subscribe(
      userId,
      (newNotification) => {
        refetch();
        switch (newNotification.type) {
          case "newSubmission":
          case "editSubmission":
          case "deleteSubmission":
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.TEACHER_SUBMISSIONS, userId],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.SUBMISSIONS],
            });
            break;
          case "censoredSubmission":
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.TEACHER_SUBMISSIONS, userId],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.SUBMISSIONS],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.CENSORED_SUBMISSIONS],
            });
            break;
          case "archiveSubmission":
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.TEACHER_ARCHIVED, userId],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.ARCHIVED_SUBMISSIONS],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.TEACHER_SUBMISSIONS, userId],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.SUBMISSIONS],
            });
            break;
          case "approvedSubmission":
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.TEACHER_SUBMISSIONS, userId],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.SUBMISSIONS],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.CENSORED_SUBMISSIONS],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.TEACHER_CENSORED, userId],
            });
            break;
          default:
            break;
        }
        toast(newNotification.message);
      }
    );

    return unsubscribe;
  }, [userId, refetch]);

  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      markAsRead(notificationId);
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(() => {
    if (unreadCount > 0) {
      markAllAsRead(userId);
    }
  }, [markAllAsRead, userId, unreadCount]);

  return (
    <header className="border-b bg-white relative z-20">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 pl-16 md:pl-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-2rem)] sm:w-80 p-0" align="end" sideOffset={8} collisionPadding={16} forceMount>
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h3 className="text-sm font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <ScrollArea className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : notifications && notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 hover:bg-accent transition-colors cursor-pointer",
                          !notification.read && "bg-accent/50"
                        )}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                { addSuffix: true }
                              )}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarFallback className="bg-slate-200 text-slate-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
