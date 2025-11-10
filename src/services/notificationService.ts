import { RealtimeChannel } from "@supabase/supabase-js";
import type { Notification } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { AppError } from "@/utils";

async function getRecipientsByRole(
  senderRole: string,
  teacherId?: string
): Promise<string[]> {
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, role");
  if (error || !users) return [];

  let recipients: string[] = [];

  if (senderRole === "teacher") {
    // Teachers notify all admins and secretaries
    recipients = users
      .filter((u) => u.role === "admin" || u.role === "secretary")
      .map((u) => u.id);
  } else if (senderRole === "secretary") {
    // Secretaries notify the specific teacher and all admins
    const teacher = teacherId ? users.find((u) => u.id === teacherId) : null;
    const admins = users.filter((u) => u.role === "admin").map(u => u.id);
    
    if (teacher) {
      recipients.push(teacher.id);
    }
    recipients = [...new Set([...recipients, ...admins])]; // Ensure no duplicates
  } else if (senderRole === "admin") {
    // Admins notify the secretary and/or teacher
    const secretaries = users
      .filter((u) => u.role === "secretary")
      .map(u => u.id);
      
    if (teacherId) {
      const teacher = users.find((u) => u.id === teacherId);
      if (teacher) {
        recipients.push(teacher.id);
      }
    }
    
    recipients = [...new Set([...recipients, ...secretaries])]; // Ensure no duplicates
  }

  // Exclude sender if somehow included
  return recipients.filter((id) => id !== senderRole);
}
export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("receiver_id", userId)
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
    const recipients = await getRecipientsByRole(senderRole, teacherId);
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
}

};
