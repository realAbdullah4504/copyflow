import type { Notification } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { AppError } from "@/utils";

async function getRecipientsByRole(
  senderId: string,
  senderRole: string,
  teacherId?: string
): Promise<string[]> {
  // Step 1: Fetch sender's admin_id (this is key for scoping)
  const { data: senderData, error: senderError } = await supabase
    .from("profiles")
    .select("id, role, admin_id")
    .eq("id", senderId)
    .single();

  if (senderError || !senderData) return [];

  const adminId =
    senderData.role === "admin"
      ? senderData.id // If sender is an admin, use their own ID
      : senderData.admin_id;

  if (!adminId) return [];

  // Step 2: Fetch all users under this admin (including admin)
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, role, admin_id");

  if (usersError || !users) return [];

  // Filter only those who belong to the same admin scope
  const scopedUsers = users.filter(
    (u) => u.id === adminId || u.admin_id === adminId
  );

  let recipients: string[] = [];

  if (senderRole === "teacher") {
    // Notify the admin and secretary under same admin
    recipients = scopedUsers
      .filter((u) => u.role === "admin" || u.role === "secretary")
      .map((u) => u.id);
  } else if (senderRole === "secretary") {
    // Notify teacher and admin in same admin scope
    const admins = scopedUsers
      .filter((u) => u.role === "admin")
      .map((u) => u.id);
    const teacher = teacherId
      ? scopedUsers.find((u) => u.id === teacherId)
      : null;

    if (teacher) recipients.push(teacher.id);
    recipients = [...new Set([...recipients, ...admins])];
  } else if (senderRole === "admin") {
    // Notify teacher and secretary under this admin
    const secretaries = scopedUsers
      .filter((u) => u.role === "secretary")
      .map((u) => u.id);

    if (teacherId) {
      const teacher = scopedUsers.find((u) => u.id === teacherId);
      if (teacher) recipients.push(teacher.id);
    }

    recipients = [...new Set([...recipients, ...secretaries])];
  }

  // Remove sender from recipients
  return recipients.filter((id) => id !== senderId);
}

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("receiver_id", userId)
      .limit(10)
      .order("created_at", { ascending: false });

    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }

    const notifications = data?.map((notification) => {
      return {
        senderId: notification.sender_id,
        receiverId: notification.receiver_id,
        message: notification.message,
        read: notification.is_read,
        type: notification.type,
        createdAt: notification.created_at,
        id: notification.id,
      };
    });
    return notifications || [];
  },

  async createNotification(
    senderId: string,
    senderRole: string,
    message: string,
    type: string,
    teacherId?: string
  ) {
    const recipients = await getRecipientsByRole(
      senderId,
      senderRole,
      teacherId
    );
    if (!recipients.length) return;

    const { error } = await supabase.from("notifications").insert(
      recipients.map((receiverId) => ({
        sender_id: senderId,
        receiver_id: receiverId,
        message,
        type,
      }))
    );

    if (error) {
      console.error("Error creating notifications:", error);
      throw new Error(error.message);
    }
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);
    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
  },
  async markAllRead(userId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("receiver_id", userId);
    if (error) {
      const appError = await AppError.from(error);
      throw appError;
    }
  },
  subscribe(
    currentUserId: string,
    onNotificationReceived: (notification: Notification) => void
  ): () => void {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          onNotificationReceived(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
