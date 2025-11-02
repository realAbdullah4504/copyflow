import type { UserRole } from "@/types";

export const getRoleBadgeVariant = (role: UserRole) => {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-800";
    case "teacher":
      return "bg-blue-100 text-blue-800";
    case "secretary":
      return "bg-green-100 text-green-800";
    case "principal":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};