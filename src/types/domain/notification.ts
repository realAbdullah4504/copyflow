type NotificationType =
  | "newSubmission"
  | "editSubmission"
  | "archiveSubmission"
  | "censoredSubmission"
  | "approvedSubmission"
  | "deleteSubmission";

export interface Notification {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: NotificationType;
}
