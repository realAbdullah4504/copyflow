import { useMutation } from "@tanstack/react-query";
import { notificationService } from "../../services/notificationService";
import { QUERY_KEYS } from "@/config";
import { mutationHandlers } from "..";

export const useCreateNotification = () => {
  const createNotification = useMutation({
    mutationFn: ({
      senderId,
      senderRole,
      message,
      type,
      teacherId,
    }: {
      senderId: string;
      senderRole: string;
      message: string;
      type: string;
      teacherId?: string;
    }) =>
      notificationService.createNotification(
        senderId,
        senderRole,
        message,
        type,
        teacherId
      ),
    ...mutationHandlers({
      successMessage: "Notification created successfully",
      invalidateKeys: [QUERY_KEYS.NOTIFICATIONS],
    }),
  });

  return {
    createNotification: createNotification.mutate,
    isCreatingNotification: createNotification.isPending,
  };
};
