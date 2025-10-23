import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

export const ADMIN_STAT_DATA = [
  {
    icon: FileText,
    iconBg: "bg-blue-100 text-blue-600",
    label: "Total Submissions",
    valueKey: "totalSubmissions",
  },
  {
    icon: Clock,
    iconBg: "bg-green-100 text-green-600",
    label: "Pending",
    valueKey: "pendingSubmissions",
  },
  {
    icon: CheckCircle,
    iconBg: "bg-slate-100 text-slate-600",
    label: "Completed Today",
    valueKey: "completedToday",
  },
  {
    icon: AlertCircle,
    iconBg: "bg-red-100 text-red-600",
    label: "Flagged",
    valueKey: "flaggedSubmissions",
  },
];
