import { SettingsIcon } from "lucide-react";
import DashboardIcon from "./DashboardIcon";
import UsersIcon from "./UsersIcon";
import type { IconName } from "@/types";

const icons: Record<IconName, React.ComponentType<{ className?: string }>> = {
  "dashboard-icon": DashboardIcon,
  "users-icon": UsersIcon,
  "settings-icon": SettingsIcon,
  // Add more icons as needed
};

export const Icon = ({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) => {
  const IconComponent = icons[name];
  return <IconComponent className={className} />;
};
