import { QUERY_KEYS } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services";
import type { Notification } from "@/types";

export const useGetNotifications = (userId: string) => {
  console.log(userId);
  const { data, isLoading, error,...rest } = useQuery<Notification[]>({
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
    queryFn: () => notificationService.getNotifications(userId),
    enabled: !!userId,
  });

  return { data, isLoading, error, ...rest };
};
