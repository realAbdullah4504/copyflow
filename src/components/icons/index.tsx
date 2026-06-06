import { SettingsIcon } from "lucide-react";
import DashboardIcon from "./DashboardIcon";
import UsersIcon from "./UsersIcon";

type IconName = "dashboard-icon" | "users-icon" | "settings-icon";

const icons: Record<IconName, React.ComponentType<{ className?: string }>> = {
  "dashboard-icon": DashboardIcon,
  "users-icon": UsersIcon,
  "settings-icon": SettingsIcon,
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
